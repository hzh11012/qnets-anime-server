const prisma = require('@core/prisma');

class AnimeTopicDao {
    static async delete(id) {
        return await prisma.animeTopic.delete({where: {id}});
    }

    static async findById(id, where, select) {
        return await prisma.animeTopic.findUnique({
            where: {id, ...where},
            select
        });
    }

    static async create(data) {
        return await prisma.animeTopic.create({data});
    }

    static async findByName(name) {
        return await prisma.animeTopic.findFirst({where: {name}});
    }

    static async list({where, skip, take, orderBy, select, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.animeTopic.count({where}),
            prisma.animeTopic.findMany({
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

    static async update(id, data) {
        return await prisma.animeTopic.update({
            where: {id},
            data
        });
    }
}

module.exports = AnimeTopicDao;
