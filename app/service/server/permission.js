const PermissionDao = require('@dao/permission');
const {NotFound, Existing} = require('@core/http-exception');

class PermissionService {
    /**
     * @title 权限创建
     * @param {string} name 权限名称
     * @param {string} permission 权限编码
     */
    static async create({name, permission}) {
        try {
            // 检查权限是否存在
            const existing = await PermissionDao.findByPermission(permission);
            if (existing) throw new Existing('权限已存在');

            const data = {name, permission};
            return await PermissionDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 权限删除
     * @param {string} id 权限ID
     */
    static async delete({id}) {
        try {
            // 检查权限及其关联
            const existing = await PermissionDao.findByIdWithRelations(id);
            if (!existing) throw new NotFound('权限不存在');
            if (existing.roles.length > 0)
                throw new Existing('无法删除：权限存在关联角色');

            return await PermissionDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 权限列表
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
                include: {roles: {select: {name: true}}},
                omit: {updatedAt: true}
            };

            return await PermissionDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 权限选项
     */
    static async options() {
        try {
            const params = {
                select: {id: true, name: true},
                orderBy: {createdAt: 'desc'}
            };

            const result = await PermissionDao.list(params);

            return result.rows.map(item => ({
                label: item.name,
                value: item.id
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PermissionService;
