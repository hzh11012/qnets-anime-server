const prisma = require('@core/prisma');
const {NotFound} = require('@core/http-exception');

class UserDao {
    static async findByPhone(phone) {
        const user = await prisma.user.findUnique({
            where: {phone},
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        if (!user) throw new NotFound('用户不存在');

        const permissions = user.roles.flatMap(role =>
            role.permissions.map(p => p.permission)
        );

        const {roles, ...rest} = user;

        return {...rest, permissions};
    }
}

module.exports = UserDao;
