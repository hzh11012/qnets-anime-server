const elastic = require('@core/es');

const initAnimeIndex = async () => {
    const indexName = 'anime_index';

    try {
        const exists = await elastic.indices.exists({index: indexName});
        if (exists) return;

        await elastic.indices.create({
            index: indexName,
            body: {
                settings: {
                    number_of_shards: 3,
                    number_of_replicas: 0,
                    analysis: {
                        analyzer: {
                            // 用于搜索动漫名称和描述
                            anime_search: {
                                type: 'custom',
                                tokenizer: 'ik_smart'
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        id: {type: 'keyword'},
                        seriesId: {type: 'keyword'},
                        name: {
                            type: 'text',
                            analyzer: 'anime_search',
                            fields: {
                                raw: {type: 'keyword'},
                                suggest: {
                                    type: 'completion',
                                    analyzer: 'simple'
                                }
                            }
                        },
                        description: {type: 'text', analyzer: 'anime_search'},
                        remark: {type: 'text', analyzer: 'anime_search'},
                        coverUrl: {type: 'keyword'},
                        bannerUrl: {type: 'keyword'},
                        status: {type: 'byte'}, // 0-即将上线 1-连载中 2-已完结
                        type: {type: 'byte'}, // 0-剧场版 1-日番 2-美番 3-国番 4-里番
                        year: {type: 'short'},
                        month: {type: 'byte'}, // 0-一月番 1-四月番 2-七月番 3-十月番
                        season: {type: 'byte'},
                        seasonName: {type: 'keyword'},
                        director: {
                            type: 'text',
                            analyzer: 'anime_search',
                            fields: {
                                raw: {type: 'keyword'}
                            }
                        },
                        cv: {type: 'text', analyzer: 'anime_search'},
                        tags: {type: 'keyword'},
                        topics: {type: 'keyword'},
                        createdAt: {type: 'date'},
                        updatedAt: {type: 'date'},

                        // 聚合统计字段 (用于排序和筛选)
                        averageRating: {type: 'half_float'},
                        ratingCount: {type: 'integer'},
                        collectionCount: {type: 'integer'},
                        playCount: {type: 'long'},
                        videoCount: {type: 'integer'},
                        videoId: {type: 'keyword'}
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

initAnimeIndex();
