const prisma = require('@core/prisma');
const {NotFound} = require('@core/http-exception');

class UserDao {
    static async findByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {email},
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
        orderBy: _orderBy = 'createdAt'
    }) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where = {
            [type]: {contains: keyword},
            status: status.length ? {in: status} : {}
        };
        const orderBy = {[_orderBy]: order.toLocaleLowerCase()};
        const include = {
            roles: {select: {name: true}}
        };
        const omit = {updatedAt: true};

        const [total, rows] = await Promise.all([
            prisma.user.count({where}),
            prisma.user.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
                omit
            })
        ]);

        return {rows, total};
    }

    /**
     * @title 用户编辑
     * @param {string} id 用户ID
     * @param {string} nickname 用户昵称
     * @param {string} avatar 用户头像
     * @param {number} status 用户状态
     */
    static async edit({id, nickname, avatar, status}) {
        const existing = await prisma.user.findUnique({where: {id}});
        if (!existing) throw new NotFound('用户不存在');

        let data = {nickname, avatar, status};

        return await prisma.user.update({
            where: {id},
            data
        });
    }
}

module.exports = UserDao;
