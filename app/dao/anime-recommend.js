const prisma = require('@core/prisma');

class AnimeDao {
    static async delete(id) {
        return await prisma.animeRecommend.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeRecommend.findUnique({where: {id}});
    }

    static async create(data) {
        return await prisma.animeRecommend.create({data});
    }

    static async findByName(name) {
        return await prisma.animeRecommend.findFirst({where: {name}});
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeRecommend.count({where}),
            prisma.animeRecommend.findMany({
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
        return await prisma.animeRecommend.update({
            where: {id},
            data
        });
    }
}

module.exports = AnimeDao;
