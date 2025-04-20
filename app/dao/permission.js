const prisma = require('@core/prisma');
const {NotFound, Existing} = require('@core/http-exception');

class PermissionDao {
    /**
     * @title 权限创建
     * @param {string} name 权限名称
     * @param {string} permission 权限编码
     */
    static async create({name, permission}) {
        const existing = await prisma.permission.findUnique({
            where: {permission}
        });

        if (existing) throw new Existing('权限已存在');

        return await prisma.permission.create({
            data: {name, permission}
        });
    }

    /**
     * @title 权限删除
     * @param {string} id 权限ID
     */
    static async delete({id}) {
        const existing = await prisma.permission.findUnique({
            where: {id},
            include: {roles: true}
        });

        if (!existing) throw new NotFound('权限不存在');

        if (existing.roles.length > 0)
            throw new Existing('无法删除：权限存在关联角色');

        return await prisma.permission.delete({
            where: {id}
        });
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
        const results = await prisma.permission.findMany({
            omit: {
                updatedAt: true
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                [type]: {
                    contains: keyword
                }
            },
            orderBy: {
                [orderBy]: order.toLocaleLowerCase()
            },
            include: {
                roles: {
                    select: {name: true}
                }
            }
        });

        return results;
    }
}

module.exports = PermissionDao;
