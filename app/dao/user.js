const prisma = require('@core/prisma');

class UserDao {
    static async findById(id) {
        return await prisma.user.findUnique({where: {id}});
    }

    static async findByEmailWithRelations(email) {
        return await prisma.user.findUnique({
            where: {email},
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
    }

    static async findRolesByIds(ids) {
        return await prisma.role.findMany({
            where: {id: {in: ids}}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.user.count({where}),
            prisma.user.findMany({where, skip, take, orderBy, include, omit})
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.user.update({
            where: {id},
            data
        });
    }
}

module.exports = UserDao;
