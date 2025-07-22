const prisma = require('@core/prisma');

class VideoDao {
    static async create(data) {
        return await prisma.video.create({data});
    }

    static async delete(id) {
        return await prisma.video.delete({where: {id}});
    }

    static async findById(id, select) {
        return await prisma.video.findUnique({where: {id}, select});
    }

    static async findByAnimeIdAndEpisode(animeId, episode) {
        return await prisma.video.findUnique({
            where: {animeId_episode: {animeId, episode}}
        });
    }

    static async list({where, skip, take, orderBy, include, omit, select}) {
        const [total, rows] = await Promise.all([
            prisma.video.count({where}),
            prisma.video.findMany({
                where,
                skip,
                take,
                select,
                orderBy,
                include,
                omit
            })
        ]);
        return {rows, total};
    }

    static async count({where}) {
        return await prisma.video.count({where});
    }

    static async getTotalPlayCountByAnimeId(animeId) {
        const videos = await prisma.video.findMany({
            where: {animeId},
            select: {playCount: true}
        });
        return videos.reduce((sum, v) => sum + (v.playCount || 0), 0);
    }

    static async getTotalPlayCountByAnimeIds(animeIds) {
        const result = await prisma.video.groupBy({
            by: ['animeId'],
            where: {animeId: {in: animeIds}},
            _sum: {playCount: true}
        });
        return result.map(r => ({
            animeId: r.animeId,
            playCount: r._sum.playCount || 0
        }));
    }

    static async update(id, data) {
        return await prisma.video.update({
            where: {id},
            data
        });
    }
}

module.exports = VideoDao;
