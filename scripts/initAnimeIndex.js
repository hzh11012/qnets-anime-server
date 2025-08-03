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
                            },
                            // 添加拼音分析器
                            pinyin_analyzer: {
                                tokenizer: 'pinyin_tokenizer',
                                filter: ['lowercase']
                            },
                            pinyin_initials_analyzer: {
                                tokenizer: 'pinyin_initials_tokenizer',
                                filter: ['lowercase']
                            }
                        },
                        tokenizer: {
                            pinyin_tokenizer: {
                                type: 'pinyin',
                                keep_first_letter: true, // 保留首字母
                                keep_separate_first_letter: false,
                                keep_full_pinyin: true, // 保留全拼
                                keep_original: true, // 保留原始输入
                                limit_first_letter_length: 16,
                                lowercase: true, // 小写处理
                                remove_duplicated_term: true // 删除重复词
                            },
                            pinyin_initials_tokenizer: {
                                type: 'pinyin',
                                keep_first_letter: true, // 只保留首字母
                                keep_separate_first_letter: true,
                                keep_full_pinyin: false, // 不保留全拼
                                keep_original: false, // 不保留原始输入
                                lowercase: true // 小写处理
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        id: {type: 'keyword'},
                        seriesId: {type: 'keyword'},
                        name: {
                            type: 'search_as_you_type',
                            analyzer: 'ik_smart',
                            fields: {
                                raw: {type: 'keyword'},
                                pinyin: {
                                    type: 'text',
                                    analyzer: 'pinyin_analyzer',
                                    search_analyzer: 'pinyin_analyzer'
                                },
                                // 添加首字母缩写字段
                                initials: {
                                    type: 'text',
                                    analyzer: 'pinyin_initials_analyzer',
                                    search_analyzer: 'pinyin_initials_analyzer'
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
                        director: {type: 'text', analyzer: 'anime_search'},
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
