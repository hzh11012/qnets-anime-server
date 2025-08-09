/**
 * @title es定时任务
 * @description 每15分钟同步一次es
 */

const cron = require('node-cron');
const elastic = require('@core/es');
const prisma = require('@core/prisma');

// 使用scroll API获取所有ES文档ID
async function getAllEsAnimeIds() {
    const esAnimeIds = [];

    try {
        // 初始化scroll搜索
        const initialResponse = await elastic.search({
            index: 'anime_index',
            scroll: '5m', // 设置scroll保持时间为5分钟
            body: {
                query: {match_all: {}},
                size: 1000, // 每批获取1000个文档
                _source: false // 只获取ID，不获取文档内容
            }
        });

        let scrollId = initialResponse._scroll_id;
        let hits = initialResponse.hits.hits;

        // 收集第一批结果
        hits.forEach(hit => esAnimeIds.push(hit._id));

        // 继续scroll直到没有更多结果
        while (hits.length > 0) {
            const scrollResponse = await elastic.scroll({
                scroll_id: scrollId,
                scroll: '5m'
            });

            hits = scrollResponse.hits.hits;
            hits.forEach(hit => esAnimeIds.push(hit._id));
        }

        // 清理scroll上下文
        await elastic.clearScroll({
            scroll_id: scrollId
        });

        console.log(
            `[${new Date().toISOString()}] 从ES获取到 ${esAnimeIds.length} 个动漫ID`
        );
        return esAnimeIds;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] 获取ES动漫ID失败:`, error);
        throw error;
    }
}

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

        // 获取数据库中所有动漫的ID
        const dbAnimeIds = animes.map(anime => anime.id);

        // 使用scroll API获取ES中所有动漫的ID
        const esAnimeIds = await getAllEsAnimeIds();

        // 找出需要从ES中删除的动漫ID（在ES中存在但在数据库中不存在）
        const idsToDelete = esAnimeIds.filter(id => !dbAnimeIds.includes(id));

        // 构建批量操作体
        const body = [];

        // 添加删除操作
        if (idsToDelete.length > 0) {
            console.log(
                `[${new Date().toISOString()}] 需要删除 ${idsToDelete.length} 个动漫文档`
            );
            idsToDelete.forEach(id => {
                body.push({delete: {_index: 'anime_index', _id: id}});
            });
        }

        // 添加更新/插入操作
        animes.forEach(anime => {
            body.push({index: {_index: 'anime_index', _id: anime.id}});
            body.push({
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
            });
        });

        if (body.length > 0) {
            const bulkResponse = await elastic.bulk({refresh: true, body});

            if (bulkResponse.errors) {
                const errors = bulkResponse.items.filter(
                    item => item.index?.error || item.delete?.error
                );
                console.error(
                    `[${new Date().toISOString()}] ES动漫数据同步失败：`,
                    errors
                );
            } else {
                const deletedCount = idsToDelete.length;
                const updatedCount = animes.length;
                console.log(
                    `[${new Date().toISOString()}] ES动漫数据同步完成 - 删除: ${deletedCount}, 更新/插入: ${updatedCount}`
                );
            }
        }
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] ES动漫数据同步失败：`,
            error
        );
    }
});
