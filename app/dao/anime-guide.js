const prisma = require('@core/prisma');

class AnimeGuideDao {
    static async create(data) {
        return await prisma.animeGuide.create({data});
    }

    static async delete(id) {
        return await prisma.animeGuide.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeGuide.findUnique({where: {id}});
    }

    static async findByAnimeId(animeId) {
        return await prisma.animeGuide.findUnique({where: {animeId}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeGuide.count({where}),
            prisma.animeGuide.findMany({
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
        return await prisma.animeGuide.update({
            where: {id},
            data
        });
    }
}

module.exports = AnimeGuideDao;
