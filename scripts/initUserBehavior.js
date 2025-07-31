const elastic = require('@core/es');

const initUserBehaviorIndex = async () => {
    const indexName = 'user_behavior_index';

    try {
        const exists = await elastic.indices.exists({index: indexName});
        if (exists) return;

        await elastic.indices.create({
            index: indexName,
            body: {
                settings: {
                    number_of_shards: 3,
                    number_of_replicas: 0
                },
                mappings: {
                    properties: {
                        userId: {type: 'keyword'},
                        animeId: {type: 'keyword'},
                        behaviorType: {type: 'keyword'}, // rating, collection, history
                        score: {type: 'float'}, // 评分分数，收藏和历史为0
                        weight: {type: 'float'}, // 行为权重：评分=score, 收藏=3, 历史=1
                        timestamp: {type: 'date'},
                        updatedAt: {type: 'date'}
                    }
                }
            }
        });
        console.log(`✅ 创建索引 ${indexName} 成功`);
    } catch (error) {
        console.error(
            `❌ 初始化索引 ${indexName} 错误:`,
            error.meta.body.error
        );
    }
};

initUserBehaviorIndex();
