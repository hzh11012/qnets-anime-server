const prisma = require('@core/prisma');

class AnimeSeriesDao {
    static async create(data) {
        return await prisma.animeSeries.create({data});
    }

    static async delete(id) {
        return await prisma.animeSeries.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.animeSeries.findUnique({where: {id}});
    }

    static async findByName(name) {
        return await prisma.animeSeries.findUnique({where: {name}});
    }

    static async findByIdWithRelations(id) {
        return await prisma.animeSeries.findUnique({
            where: {id},
            include: {animes: true}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeSeries.count({where}),
            prisma.animeSeries.findMany({
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

module.exports = AnimeSeriesDao;
