const prisma = require('@core/prisma');

class VideoHistoryDao {
    static async create(data) {
        return await prisma.videoHistory.create({data});
    }

    static async delete(id) {
        return await prisma.videoHistory.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.videoHistory.findUnique({where: {id}});
    }

    static async findByUserIdAndAnimeId(userId, animeId) {
        return await prisma.videoHistory.findUnique({
            where: {userId_animeId: {userId, animeId}}
        });
    }

    static async findFirst({where, select}) {
        return await prisma.videoHistory.findFirst({where, select});
    }

    static async findMany({where, select, orderBy}) {
        return await prisma.videoHistory.findMany({where, select, orderBy});
    }

    static async findByUserId(userId) {
        return await prisma.videoHistory.findMany({where: {userId}});
    }

    static async list({where, skip, take, orderBy, include, select, omit}) {
        const [total, rows] = await Promise.all([
            prisma.videoHistory.count({where}),
            prisma.videoHistory.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
                select,
                omit
            })
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.videoHistory.update({
            where: {id},
            data
        });
    }
}

module.exports = VideoHistoryDao;
