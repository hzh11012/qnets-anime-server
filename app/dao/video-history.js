const prisma = require('@core/prisma');

class VideoHistoryDao {
    static async delete(id) {
        return await prisma.videoHistory.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.videoHistory.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.videoHistory.count({where}),
            prisma.videoHistory.findMany({
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

module.exports = VideoHistoryDao;
