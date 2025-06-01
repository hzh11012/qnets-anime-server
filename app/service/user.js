const RoleDao = require('@app/dao/role');
const UserDao = require('@dao/user');

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
     * @title 用户列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 账号状态 0-禁用 1-启用 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'email',
        status = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    [type]: {contains: keyword},
                    status: status.length ? {in: status} : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {roles: {select: {id: true, name: true}}},
                omit: {updatedAt: true}
            };

            return await UserDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 用户编辑
     * @param {string} id 用户ID
     * @param {string} nickname 用户昵称
     * @param {string} avatar 用户头像
     * @param {number} status 用户状态
     * @param {string[]} roles 角色
     */
    static async edit({id, nickname, avatar, status, roles}) {
        try {
            const existing = await UserDao.findById(id);
            if (!existing) throw new NotFound('用户不存在');

            let data = {nickname, avatar, status};

            if (roles && roles.length === 0) {
                // 清空所有关联权限
                data.roles = {set: []};
            } else if (roles) {
                const existingRoles = await RoleDao.findByIds(roles);

                if (existingRoles.length !== roles.length) {
                    const missingRoles = roles
                        .filter(id => !existingRoles.some(p => p.id === id))
                        .map(id => {
                            const role = existingRoles.find(p => p.id === id);
                            return role ? role.name : id;
                        });
                    throw new NotFound(
                        `角色不存在：${missingRoles.join(', ')}`
                    );
                }

                data.roles = {
                    set: roles.map(id => ({id}))
                };
            }

            return await UserDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
