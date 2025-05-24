const prisma = require('@core/prisma');

class AnimeDao {
    static async delete(id) {
        return await prisma.anime.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.anime.findUnique({where: {id}});
    }

    static async create(data) {
        return await prisma.anime.create({data});
    }

    static async findBySeriesAndSeason(seriesId, season) {
        return await prisma.anime.findFirst({
            where: {animeSeriesId: seriesId, season: season}
        });
    }

    static async findByIdAndSeriesAndSeason(id, seriesId, season) {
        return await prisma.anime.findFirst({
            where: {id: {not: id}, animeSeriesId: seriesId, season: season}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.anime.count({where}),
            prisma.anime.findMany({where, skip, take, orderBy, include, omit})
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.anime.update({
            where: {id},
            data
        });
    }
}

module.exports = AnimeDao;
