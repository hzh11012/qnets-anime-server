const prisma = require('@core/prisma');

class MessageDao {
    static async delete(id) {
        return await prisma.message.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.message.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.message.count({where}),
            prisma.message.findMany({where, skip, take, orderBy, include, omit})
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.message.update({
            where: {id},
            data
        });
    }
}

module.exports = MessageDao;
