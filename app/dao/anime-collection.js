const prisma = require('@core/prisma');

class AnimeCollectionDao {
    static async create(data) {
        return await prisma.animeCollection.create({data});
    }

    static async delete(id) {
        return await prisma.animeCollection.delete({where: {id}});
    }

    static async deleteByUserAndAnime(userId, animeId) {
        return await prisma.animeCollection.delete({
            where: {userId_animeId: {userId, animeId}}
        });
    }

    static async findById(id) {
        return await prisma.animeCollection.findUnique({where: {id}});
    }

    static async findByUserId(userId) {
        return await prisma.animeCollection.findMany({where: {userId}});
    }

    static async findByUserIds(userIds) {
        return await prisma.animeCollection.findMany({
            where: {userId: {in: userIds}}
        });
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

    static async rawOptions({where, userId, page, pageSize}) {
        const [total, rows] = await Promise.all([
            prisma.animeCollection.count({where}),
            prisma.$queryRaw`
                SELECT 
                    vh.time,
                    a.name,
                    a.bannerUrl,
                    a.status,
                    v.id AS videoId,
                    lv.id AS latestVideoId,
                    CAST(v.episode AS CHAR) AS episode,
                    (SELECT CAST(COUNT(*) AS CHAR) FROM Video vv WHERE vv.animeId = ac.animeId) AS videoCount
                FROM AnimeCollection ac
                LEFT JOIN VideoHistory vh
                    ON ac.userId = vh.userId AND ac.animeId = vh.animeId
                LEFT JOIN Anime a
                    ON ac.animeId = a.id
                LEFT JOIN Video v
                    ON vh.videoId = v.id
                LEFT JOIN LATERAL (
                    SELECT id, episode, createdAt
                    FROM Video
                    WHERE animeId = ac.animeId
                    ORDER BY episode ASC
                    LIMIT 1
                ) lv ON TRUE
                WHERE ac.userId = ${userId}
                ORDER BY (vh.updatedAt IS NULL), vh.updatedAt DESC, ac.createdAt DESC
                LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
            `
        ]);

        return {total, rows};
    }

    static async countByAnimeId(animeId) {
        return await prisma.animeCollection.count({where: {animeId}});
    }

    static async findByUserAndAnime(userId, animeId) {
        return await prisma.animeCollection.findUnique({
            where: {userId_animeId: {userId, animeId}}
        });
    }
}

module.exports = AnimeCollectionDao;
