const prisma = require('@core/prisma');

class AnimeCollectionDao {
    static async delete(id) {
        return await prisma.animeCollection.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeCollection.findUnique({where: {id}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeCollection.count({where}),
            prisma.animeCollection.findMany({
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

module.exports = AnimeCollectionDao;
