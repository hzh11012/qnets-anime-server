const RoleDao = require('@dao/role');
const {NotFound, Existing} = require('@core/http-exception');

class RoleService {
    /**
     * @title 角色创建
     * @param {string} name 角色名称
     * @param {string} role 角色编码
     * @param {string[]} permissions 权限
     */
    static async create({name, role, permissions}) {
        try {
            // 检查角色是否存在
            const existing = await RoleDao.findByRole(role);
            if (existing) throw new Existing('角色已存在');

            let data = {name, role};

            // 处理权限关联
            if (permissions && permissions.length) {
                const existingPermissions =
                    await RoleDao.findPermissionsByIds(permissions);

                if (existingPermissions.length !== permissions.length) {
                    const missingPermissions = permissions.filter(
                        id => !existingPermissions.some(p => p.id === id)
                    );
                    throw new NotFound(
                        `权限不存在：${missingPermissions.join(', ')}`
                    );
                }
                data.permissions = {
                    connect: permissions.map(id => ({id}))
                };
            }

            return await RoleDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 角色删除
     * @param {string} id 角色ID
     */
    static async delete({id}) {
        try {
            // 检查角色及其关联
            const existing = await RoleDao.findByIdWithRelations(id);
            if (!existing) throw new NotFound('角色不存在');

            if (existing.users.length)
                throw new Existing('无法删除：角色存在关联用户');
            if (existing.permissions.length)
                throw new Existing('无法删除：角色存在关联权限');

            return await RoleDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 角色编辑
     * @param {string} id 角色ID
     * @param {string} name 角色名称
     * @param {string} role 角色编码
     * @param {string[]} permissions 权限
     */
    static async edit({id, name, role, permissions}) {
        try {
            const existing = await RoleDao.findById(id);
            if (!existing) throw new NotFound('角色不存在');

            let data = {name, role};

            if (permissions && permissions.length === 0) {
                // 清空所有关联权限
                data.permissions = {set: []};
            } else if (permissions) {
                const existingPermissions =
                    await RoleDao.findPermissionsByIds(permissions);

                if (existingPermissions.length !== permissions.length) {
                    const missingPermissions = permissions.filter(
                        id => !existingPermissions.some(p => p.id === id)
                    );
                    throw new NotFound(
                        `权限不存在：${missingPermissions.join(', ')}`
                    );
                }

                data.permissions = {
                    set: permissions.map(id => ({id}))
                };
            }

            return await RoleDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 角色列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'name',
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {[type]: {contains: keyword}},
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    permissions: {select: {id: true, name: true}},
                    users: {select: {nickname: true}}
                },
                omit: {updatedAt: true}
            };

            return await RoleDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleService;
