const prisma = require('@core/prisma');

class VideoDao {
    static async create(data) {
        return await prisma.video.create({data});
    }

    static async delete(id) {
        return await prisma.video.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.video.findUnique({where: {id}});
    }

    static async findByAnimeIdAndEpisode(animeId, episode) {
        return await prisma.video.findUnique({where: {animeId, episode}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.video.count({where}),
            prisma.video.findMany({
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
        return await prisma.video.update({
            where: {id},
            data
        });
    }
}

module.exports = VideoDao;
