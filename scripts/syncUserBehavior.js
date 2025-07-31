/**
 * @title es定时任务
 * @description 每15分钟同步一次es
 */

const cron = require('node-cron');
const elastic = require('@core/es');
const prisma = require('@core/prisma');

cron.schedule('*/15 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] 开始同步ES用户行为数据...`);

    try {
        // 获取所有用户行为数据
        const [ratings, collections, histories] = await Promise.all([
            prisma.animeRating.findMany({
                select: {
                    userId: true,
                    animeId: true,
                    score: true,
                    updatedAt: true
                }
            }),
            prisma.animeCollection.findMany({
                select: {
                    userId: true,
                    animeId: true,
                    updatedAt: true
                }
            }),
            prisma.videoHistory.findMany({
                select: {
                    userId: true,
                    animeId: true,
                    updatedAt: true
                }
            })
        ]);

        // 构建ES文档
        const behaviorDocs = [];

        // 评分行为
        ratings.forEach(rating => {
            behaviorDocs.push({
                userId: rating.userId,
                animeId: rating.animeId,
                behaviorType: 'rating',
                score: rating.score,
                weight: rating.score,
                timestamp: rating.updatedAt,
                updatedAt: rating.updatedAt
            });
        });

        // 收藏行为
        collections.forEach(collection => {
            behaviorDocs.push({
                userId: collection.userId,
                animeId: collection.animeId,
                behaviorType: 'collection',
                score: 0,
                weight: 3,
                timestamp: collection.updatedAt,
                updatedAt: collection.updatedAt
            });
        });

        // 历史行为
        histories.forEach(history => {
            behaviorDocs.push({
                userId: history.userId,
                animeId: history.animeId,
                behaviorType: 'history',
                score: 0,
                weight: 1,
                timestamp: history.updatedAt,
                updatedAt: history.updatedAt
            });
        });

        const body = behaviorDocs.flatMap(doc => [
            {
                index: {
                    _index: 'user_behavior_index',
                    _id: doc.userId + '-' + doc.animeId + '-' + doc.behaviorType
                }
            },
            doc
        ]);

        const bulkResponse = await elastic.bulk({refresh: true, body});

        if (bulkResponse.errors) {
            console.error(
                `[${new Date().toISOString()}] ES用户行为数据同步失败：`,
                bulkResponse.items.filter(item => item.index.error)
            );
        } else {
            console.log(`[${new Date().toISOString()}] ES用户行为数据同步完成`);
        }
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] ES用户行为数据同步失败：`,
            error
        );
    }
});
