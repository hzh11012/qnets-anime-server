const prisma = require('@core/prisma');

class RoleDao {
    static async create(data) {
        return await prisma.role.create({data});
    }

    static async delete(id) {
        return await prisma.role.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.role.findUnique({where: {id}});
    }

    static async findByRole(role) {
        return await prisma.role.findUnique({where: {role}});
    }

    static async findByIdWithRelations(id) {
        return await prisma.role.findUnique({
            where: {id},
            include: {users: true, permissions: true}
        });
    }

    static async findPermissionsByIds(ids) {
        return await prisma.permission.findMany({
            where: {id: {in: ids}}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.role.count({where}),
            prisma.role.findMany({where, skip, take, orderBy, include, omit})
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.role.update({
            where: {id},
            data,
            include: {
                permissions: {
                    select: {id: true, name: true}
                }
            }
        });
    }
}

module.exports = RoleDao;
