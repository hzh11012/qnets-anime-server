const prisma = require('@core/prisma');

class AnimeRatingDao {
    static async delete(id) {
        return await prisma.animeRating.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeRating.findUnique({where: {id}});
    }

    static async findByUserId(userId) {
        return await prisma.animeRating.findMany({where: {userId}});
    }

    static async findByUserIds(userIds) {
        return await prisma.animeRating.findMany({
            where: {userId: {in: userIds}}
        });
    }

    static async findByAnimeIds(animeIds) {
        return await prisma.animeRating.findMany({
            where: {animeId: {in: animeIds}}
        });
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
