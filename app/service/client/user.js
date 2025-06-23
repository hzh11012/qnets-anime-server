const UserDao = require('@dao/user');
const {NotFound} = require('@core/http-exception');

class UserService {
    /**
     * @title 用户信息
     * @param {string} email - 邮箱
     */
    static async info(email) {
        try {
            // 检查用户是否存在
            const existing = await UserDao.findByEmailWithRelations(email);
            if (!existing) throw new NotFound('用户不存在');

            const permissions = existing.roles.flatMap(role =>
                role.permissions.map(p => p.permission)
            );

            const {roles, ...rest} = existing;

            return {...rest, permissions};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
