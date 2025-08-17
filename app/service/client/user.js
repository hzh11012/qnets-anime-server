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

    /**
     * @title 用户编辑
     * @param {string} email 当前用户邮箱
     * @param {string} nickname 用户昵称
     */
    static async edit({email, nickname}) {
        try {
            const existing = await UserDao.findByEmail(email);
            if (!existing) throw new NotFound('用户不存在');

            return await UserDao.updateByEmail(email, {nickname});
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
