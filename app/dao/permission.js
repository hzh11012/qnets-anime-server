const prisma = require('@core/prisma');

class PermissionDao {
    static async create(data) {
        return await prisma.permission.create({data});
    }

    static async delete(id) {
        return await prisma.permission.delete({where: {id}});
    }

    static async findByPermission(permission) {
        return await prisma.permission.findUnique({where: {permission}});
    }

    static async findByIdWithRelations(id) {
        return await prisma.permission.findUnique({
            where: {id},
            include: {roles: true}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.permission.count({where}),
            prisma.permission.findMany({
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
}

module.exports = PermissionDao;
