const prisma = require('@core/prisma');

class AnimeBannerDao {
    static async create(data) {
        return await prisma.animeBanner.create({data});
    }

    static async delete(id) {
        return await prisma.animeBanner.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeBanner.findUnique({where: {id}});
    }

    static async findByAnimeId(animeId) {
        return await prisma.animeBanner.findUnique({where: {animeId}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeBanner.count({where}),
            prisma.animeBanner.findMany({
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

module.exports = AnimeBannerDao;
