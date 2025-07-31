/**
 * @title es定时任务
 * @description 每15分钟同步一次es
 */

const cron = require('node-cron');
const elastic = require('@core/es');
const prisma = require('@core/prisma');

cron.schedule('*/15 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] 开始同步ES动漫数据...`);

    try {
        // 获取所有动漫及其关联数据
        const animes = await prisma.anime.findMany({
            include: {
                animeTags: {select: {name: true}},
                animeTopics: {select: {name: true}},
                _count: {select: {animeCollections: true}},
                animeRatings: {select: {score: true}},
                videos: {
                    select: {id: true, playCount: true},
                    orderBy: {episode: 'asc'}
                }
            }
        });

        const body = animes.flatMap(anime => [
            {index: {_index: 'anime_index', _id: anime.id}},
            {
                id: anime.id,
                seriesId: anime.animeSeriesId,
                name: `${anime.name} ${anime.seasonName}`.trim(),
                description: anime.description,
                remark: anime.remark,
                coverUrl: anime.coverUrl,
                bannerUrl: anime.bannerUrl,
                status: anime.status,
                type: anime.type,
                director: anime.director,
                cv: anime.cv,
                year: anime.year,
                month: anime.month,
                season: anime.season,
                createdAt: anime.createdAt,
                updatedAt: anime.updatedAt,
                tags: anime.animeTags.map(tag => tag.name),
                topics: anime.animeTopics.map(topic => topic.name),
                averageRating:
                    anime.animeRatings.length > 0
                        ? anime.animeRatings.reduce(
                              (sum, rating) => sum + rating.score,
                              0
                          ) / anime.animeRatings.length
                        : 0,
                ratingCount: anime.animeRatings.length,
                collectionCount: anime._count.animeCollections,
                playCount: anime.videos.reduce(
                    (sum, video) => sum + video.playCount,
                    0
                ),
                videoCount: anime.videos.length,
                videoId: anime.videos[0]?.id || undefined
            }
        ]);

        const bulkResponse = await elastic.bulk({refresh: true, body});

        if (bulkResponse.errors) {
            console.error(
                `[${new Date().toISOString()}] ES动漫数据同步失败：`,
                bulkResponse.items.filter(item => item.index.error)
            );
        } else {
            console.log(`[${new Date().toISOString()}] ES动漫数据同步完成`);
        }
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] ES动漫数据同步失败：`,
            error
        );
    }
});
