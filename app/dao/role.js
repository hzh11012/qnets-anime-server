const prisma = require('@core/prisma');
const {NotFound, Existing} = require('@core/http-exception');

class RoleDao {
    /**
     * @title 角色创建
     * @param {string} name 角色名称
     * @param {string} role 角色编码
     * @param {string[]} permissions 权限
     */
    static async create({name, role, permissions}) {
        const existing = await prisma.role.findUnique({
            where: {role}
        });

        if (existing) throw new Existing('角色已存在');

        const data = {name, role};

        if (permissions && permissions.length) {
            const existingPermissions = await prisma.permission.findMany({
                where: {id: {in: permissions}}
            });

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

        return await prisma.role.create({data});
    }

    /**
     * @title 角色删除
     * @param {string} id 角色ID
     */
    static async delete({id}) {
        const existing = await prisma.role.findUnique({
            where: {id},
            include: {users: true, permissions: true}
        });

        if (!existing) throw new NotFound('角色不存在');

        if (existing.users.length)
            throw new Existing('无法删除：角色存在关联用户');
        if (existing.permissions.length)
            throw new Existing('无法删除：角色存在关联权限');

        return await prisma.role.delete({
            where: {id}
        });
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
        orderBy: _orderBy = 'createdAt'
    }) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where = {[type]: {contains: keyword}};
        const orderBy = {[_orderBy]: order.toLocaleLowerCase()};
        const include = {
            permissions: {select: {name: true}},
            users: {select: {nickname: true}}
        };
        const omit = {updatedAt: true};

        const [total, rows] = await Promise.all([
            prisma.role.count({where}),
            prisma.role.findMany({where, skip, take, orderBy, include, omit})
        ]);

        return {rows, total};
    }

    /**
     * @title 角色编辑
     * @param {string} id 角色ID
     * @param {string} name 角色名称
     * @param {string} role 角色编码
     * @param {string[]} permissions 权限
     */
    static async edit({id, name, role, permissions}) {
        let data = {name, role};

        if (permissions && permissions.length === 0) {
            // 清空所有关联权限
            data.permissions = {set: []};
        } else if (permissions) {
            const existingPermissions = await prisma.permission.findMany({
                where: {id: {in: permissions}}
            });

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

        return await prisma.role.update({
            where: {id},
            data,
            include: {
                permissions: {
                    select: {name: true}
                }
            }
        });
    }
}

module.exports = RoleDao;
