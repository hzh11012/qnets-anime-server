const prisma = require('@core/prisma');

class AnimeTagDao {
    static async create(data) {
        return await prisma.animeTag.create({data});
    }

    static async delete(id) {
        return await prisma.animeTag.delete({where: {id}});
    }

    static async findByIds(ids) {
        return await prisma.animeTag.findMany({where: {id: {in: ids}}});
    }

    static async findByName(name) {
        return await prisma.animeTag.findUnique({where: {name}});
    }

    static async findByIdWithRelations(id) {
        return await prisma.animeTag.findUnique({
            where: {id},
            include: {animes: true}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeTag.count({where}),
            prisma.animeTag.findMany({
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

module.exports = AnimeTagDao;
