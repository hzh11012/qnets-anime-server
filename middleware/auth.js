const prisma = require('@core/prisma');
const {
    AuthFailed,
    Forbidden,
    NotFound,
    HttpException
} = require('@core/http-exception');
const {got} = require('got-cjs');
const redis = require('@core/redis');
const {parseTime, random} = require('@core/utils');

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

        const cachedUserInfo = await redis.get(`info:${email}`);
        if (cachedUserInfo) {
            const {permissions, userId} = JSON.parse(cachedUserInfo);
            return [permissions, email, userId];
        }

        let user = await prisma.user.findUnique({
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

        if (!user) {
            const avatar = DICEBEAR_HOST
                ? `/avatar?radius=50&size=64&seed=${email}`
                : null;
            // 创建一个封禁的账户
            user = await prisma.user.create({
                data: {
                    email,
                    nickname: `用户${random(6)}`,
                    avatar,
                    status: 0
                }
            });
        }
        if (!user) throw new NotFound('用户不存在');

        if (user.status === 0) throw new Forbidden('用户已封禁，请联系管理员');

        const permissions = user.roles.flatMap(role =>
            role.permissions.map(p => p.permission)
        );
        const userId = user.id;

        await redis.set(
            `info:${email}`,
            JSON.stringify({permissions, userId}),
            PERMISSION_CACHE_TTL
        );

        return [permissions, email, userId];
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
            const [permissions, email, userId] = await verify(token);

            if (requiredPermissions) {
                const _requiredPermissions =
                    typeof requiredPermissions === 'string'
                        ? [requiredPermissions]
                        : requiredPermissions;

                if (!_requiredPermissions.some(p => permissions.includes(p)))
                    throw new Forbidden('权限不足');
            }

            ctx.auth = {email, permissions, userId};
            await next();
        } catch (err) {
            throw err;
        }
    };
};

module.exports = auth;
