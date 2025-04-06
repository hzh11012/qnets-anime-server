const prisma = require('@core/prisma');
const {AuthFailed, NotFound, HttpException} = require('@core/http-exception');
const {got} = require('got-cjs');
const redis = require('@core/redis');
const {parseTime} = require('@core/utils');

const verify = async token => {
    try {
        const {data} = await got(process.env.SSO_BASE_URL + '/api/sso/verify', {
            method: 'POST',
            headers: {
                Authorization: token
            }
        }).json();

        const {phone} = data;

        const cachedPermissions = await redis.get(`permission:${phone}`);
        if (cachedPermissions) return [JSON.parse(cachedPermissions), phone];

        const user = await prisma.user.findUnique({
            where: {phone},
            include: {
                roles: {
                    include: {
                        permissions: {
                            select: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) throw new NotFound('用户不存在');

        const permissions = user.roles.flatMap(role =>
            role.permissions.map(p => p.permission)
        );

        await redis.set(
            `permission:${phone}`,
            JSON.stringify(permissions),
            parseTime('1d') / 1000
        );

        return [permissions, phone];
    } catch (err) {
        if (err instanceof HttpException) throw err;
        if (err.response?.body) {
            const {code, msg} = JSON.parse(err.response.body);
            if (code && msg) {
                throw new HttpException(msg, code);
            }
        }
        throw new HttpException();
    }
};

const auth = requiredPermissions => {
    return async (ctx, next) => {
        const token = ctx.headers.authorization;
        if (!token) throw new AuthFailed('令牌缺失');

        try {
            const [permissions, phone] = await verify(token);

            const _requiredPermissions =
                typeof requiredPermissions === 'string'
                    ? [requiredPermissions]
                    : requiredPermissions;

            if (!_requiredPermissions.some(p => permissions.includes(p)))
                throw new AuthFailed('权限不足');

            ctx.auth = {phone};
        } catch (err) {
            throw err;
        } finally {
            await next();
        }
    };
};

module.exports = auth;
