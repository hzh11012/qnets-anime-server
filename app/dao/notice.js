const prisma = require('@core/prisma');

class NoticeDao {
    static async create(data) {
        return await prisma.notice.create({data});
    }

    static async delete(id) {
        return await prisma.notice.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.notice.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.notice.count({where}),
            prisma.notice.findMany({
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

    static async update(id, data) {
        return await prisma.notice.update({
            where: {id},
            data
        });
    }
}

module.exports = NoticeDao;
