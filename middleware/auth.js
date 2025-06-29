const prisma = require('@core/prisma');
const {
    AuthFailed,
    Forbidden,
    NotFound,
    HttpException
} = require('@core/http-exception');
const {got} = require('got-cjs');
const redis = require('@core/redis');
const {parseTime} = require('@core/utils');

const PERMISSION_CACHE_TTL = parseTime('1d') / 1000;

const verify = async token => {
    try {
        const {data} = await got(process.env.SSO_BASE_URL + '/api/sso/verify', {
            method: 'POST',
            headers: {
                Authorization: token
            }
        }).json();

        const {email} = data;

        const cachedPermissions = await redis.get(`permission:${email}`);
        if (cachedPermissions) return [JSON.parse(cachedPermissions), email];

        const user = await prisma.user.findUnique({
            where: {email},
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

        if (user.status === 0) throw new NotFound('用户已封禁，请联系管理员');

        const permissions = user.roles.flatMap(role =>
            role.permissions.map(p => p.permission)
        );

        await redis.set(
            `permission:${email}`,
            JSON.stringify(permissions),
            PERMISSION_CACHE_TTL
        );

        return [permissions, email];
    } catch (err) {
        if (err.response?.body) {
            const {code, msg} = JSON.parse(err.response.body);
            if (code && msg) throw new HttpException(msg, code);
        }
        throw err;
    }
};

const auth = requiredPermissions => {
    return async (ctx, next) => {
        const token = ctx.headers.authorization;
        if (!token) throw new AuthFailed('令牌缺失');

        try {
            const [permissions, email] = await verify(token);

            if (requiredPermissions) {
                const _requiredPermissions =
                    typeof requiredPermissions === 'string'
                        ? [requiredPermissions]
                        : requiredPermissions;

                if (!_requiredPermissions.some(p => permissions.includes(p)))
                    throw new Forbidden('权限不足');
            }

            ctx.auth = {email, permissions};
            await next();
        } catch (err) {
            throw err;
        }
    };
};

module.exports = auth;
