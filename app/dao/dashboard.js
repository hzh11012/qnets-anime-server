const prisma = require('@core/prisma');

class DashboardDao {
    static async user({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.user.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(createdAt) AS date,
                    COUNT(*) AS count
                FROM User
                WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
                GROUP BY DATE(createdAt)
                ORDER BY DATE(createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async anime({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.anime.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(createdAt) AS date,
                    SUM(CASE WHEN type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN type = 3 THEN 1 ELSE 0 END) AS '3',
                    SUM(CASE WHEN type = 4 THEN 1 ELSE 0 END) AS '4'
                FROM Anime
                WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
                GROUP BY DATE(createdAt)
                ORDER BY DATE(createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async comment({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.videoComment.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(vc.createdAt) AS date,
                    SUM(CASE WHEN a.type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN a.type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN a.type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN a.type = 3 THEN 1 ELSE 0 END) AS '3',
                    SUM(CASE WHEN a.type = 4 THEN 1 ELSE 0 END) AS '4'
                FROM VideoComment vc
                JOIN Video v ON vc.videoId = v.id
                JOIN Anime a ON v.animeId = a.id
                WHERE vc.createdAt >= ${startDate} AND vc.createdAt <= ${endDate}
                GROUP BY DATE(vc.createdAt)
                ORDER BY DATE(vc.createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async message({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.message.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(createdAt) AS date,
                    SUM(CASE WHEN type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN type = 3 THEN 1 ELSE 0 END) AS '3'
                FROM Message
                WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
                GROUP BY DATE(createdAt)
                ORDER BY DATE(createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async rating({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.animeRating.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(ar.createdAt) AS date,
                    SUM(CASE WHEN a.type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN a.type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN a.type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN a.type = 3 THEN 1 ELSE 0 END) AS '3',
                    SUM(CASE WHEN a.type = 4 THEN 1 ELSE 0 END) AS '4'
                FROM AnimeRating ar
                JOIN Anime a ON ar.animeId = a.id
                WHERE ar.createdAt >= ${startDate} AND ar.createdAt <= ${endDate}
                GROUP BY DATE(ar.createdAt)
                ORDER BY DATE(ar.createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async collection({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.animeCollection.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(ac.createdAt) AS date,
                    SUM(CASE WHEN a.type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN a.type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN a.type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN a.type = 3 THEN 1 ELSE 0 END) AS '3',
                    SUM(CASE WHEN a.type = 4 THEN 1 ELSE 0 END) AS '4'
                FROM AnimeCollection ac
                JOIN Anime a ON ac.animeId = a.id
                WHERE ac.createdAt >= ${startDate} AND ac.createdAt <= ${endDate}
                GROUP BY DATE(ac.createdAt)
                ORDER BY DATE(ac.createdAt) ASC
            `
        ]);

        return {total, rows};
    }

    static async play({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.video.aggregate({where, _sum: {playCount: true}}),
            prisma.$queryRaw`
                SELECT 
                    DATE(v.createdAt) AS date,
                    SUM(CASE WHEN a.type = 0 THEN v.playCount ELSE 0 END) AS '0',
                    SUM(CASE WHEN a.type = 1 THEN v.playCount ELSE 0 END) AS '1',
                    SUM(CASE WHEN a.type = 2 THEN v.playCount ELSE 0 END) AS '2',
                    SUM(CASE WHEN a.type = 3 THEN v.playCount ELSE 0 END) AS '3',
                    SUM(CASE WHEN a.type = 4 THEN v.playCount ELSE 0 END) AS '4'
                FROM Video v
                JOIN Anime a ON v.animeId = a.id
                WHERE v.createdAt >= ${startDate} AND v.createdAt <= ${endDate}
                GROUP BY DATE(v.createdAt)
                ORDER BY DATE(v.createdAt) ASC
            `
        ]);

        return {total: total._sum.playCount || 0, rows};
    }

    static async danmaku({where, startDate, endDate}) {
        const [total, rows] = await Promise.all([
            prisma.danmaku.count({where}),
            prisma.$queryRaw`
                SELECT 
                    DATE(d.createdAt) AS date,
                    SUM(CASE WHEN a.type = 0 THEN 1 ELSE 0 END) AS '0',
                    SUM(CASE WHEN a.type = 1 THEN 1 ELSE 0 END) AS '1',
                    SUM(CASE WHEN a.type = 2 THEN 1 ELSE 0 END) AS '2',
                    SUM(CASE WHEN a.type = 3 THEN 1 ELSE 0 END) AS '3',
                    SUM(CASE WHEN a.type = 4 THEN 1 ELSE 0 END) AS '4'
                FROM Danmaku d
                JOIN Video v ON d.videoId = v.id
                JOIN Anime a ON v.animeId = a.id
                WHERE d.createdAt >= ${startDate} AND d.createdAt <= ${endDate}
                GROUP BY DATE(d.createdAt)
                ORDER BY DATE(d.createdAt) ASC
            `
        ]);

        return {total, rows};
    }
}

module.exports = DashboardDao;
