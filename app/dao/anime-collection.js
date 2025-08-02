const prisma = require('@core/prisma');

class AnimeCollectionDao {
    static async create(data) {
        return await prisma.animeCollection.create({data});
    }

    static async delete(id) {
        return await prisma.animeCollection.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeCollection.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, select, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeCollection.count({where}),
            prisma.animeCollection.findMany({
                where,
                skip,
                take,
                orderBy,
                select,
                include,
                omit
            })
        ]);
        return {rows, total};
    }

    static async findByUserAndAnime(userId, animeId) {
        return await prisma.animeCollection.findUnique({
            where: {userId_animeId: {userId, animeId}}
        });
    }

    static async deleteByUserAndAnime(userId, animeId) {
        return await prisma.animeCollection.delete({
            where: {userId_animeId: {userId, animeId}}
        });
    }
}

module.exports = AnimeCollectionDao;
