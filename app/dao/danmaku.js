const prisma = require('@core/prisma');

class DanmakuDao {
    static async create(data) {
        return await prisma.danmaku.create({data});
    }

    static async delete(id) {
        return await prisma.danmaku.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.danmaku.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.danmaku.count({where}),
            prisma.danmaku.findMany({
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

module.exports = DanmakuDao;
