const prisma = require('@core/prisma');

class AnimeRatingDao {
    static async create(data) {
        return await prisma.animeRating.create({data});
    }

    static async delete(id) {
        return await prisma.animeRating.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeRating.findUnique({where: {id}});
    }

    static async findByUserId(userId) {
        return await prisma.animeRating.findMany({where: {userId}});
    }

    static async findByUserIds(userIds, where) {
        return await prisma.animeRating.findMany({
            where: {userId: {in: userIds}, ...where}
        });
    }

    static async findByAnimeIds(animeIds) {
        return await prisma.animeRating.findMany({
            where: {animeId: {in: animeIds}}
        });
    }

    static async findByUserAndAnime(userId, animeId) {
        return await prisma.animeRating.findUnique({
            where: {userId_animeId: {userId, animeId}}
        });
    }

    static async getAvgRating(animeId) {
        const result = await prisma.animeRating.aggregate({
            where: {animeId},
            _avg: {score: true}
        });
        return result._avg.score || 0;
    }

    static async getAvgRatingByAnimeIds(animeIds) {
        const result = await prisma.animeRating.groupBy({
            by: ['animeId'],
            where: {animeId: {in: animeIds}},
            _avg: {score: true}
        });
        return result.map(r => ({animeId: r.animeId, avg: r._avg.score}));
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeRating.count({where}),
            prisma.animeRating.findMany({
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
        return await prisma.animeRating.update({
            where: {id},
            data
        });
    }
}

module.exports = AnimeRatingDao;
