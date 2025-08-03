const AnimeRatingDao = require('@dao/anime-rating');
const AnimeCollectionDao = require('@dao/anime-collection');
const VideoHistoryDao = require('@dao/video-history');
const VideoDao = require('@dao/video');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const {Forbidden, NotFound} = require('@core/http-exception');
const elastic = require('@core/es');

class AnimeService {
    /**
     * @title 首页动漫获取 (用于首页)
     * @param {string} userId 当前用户ID
     * @param {string[]} permissions 当前用户权限
     * @param {number} type 动漫类型 0-剧场版 1-日番 2-美番 3-国番 4-里番
     */
    static async options({permissions, type, userId}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            if (type === 4 && !isAllowAnimeType4)
                throw new Forbidden('权限不足');

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {bool: {must: [{term: {type: type}}]}},
                    sort: [
                        {year: {order: 'desc'}},
                        {month: {order: 'desc'}},
                        {updatedAt: {order: 'desc'}}
                    ],
                    size: 7,
                    _source: [
                        'id',
                        'name',
                        'remark',
                        'coverUrl',
                        'status',
                        'videoCount',
                        'videoId'
                    ]
                }
            };

            const animes = await elastic.search(queryBody);

            const total = animes.hits.hits.length;
            const rows = await this.formatAnime(animes.hits.hits, userId);

            return {total, rows};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 综合评分、追番、历史记录的协同过滤推荐
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} userId 当前用户ID
     * @param {string[]} permissions 当前用户权限
     */
    static async guessYouLike({page = 1, pageSize = 10, userId, permissions}) {
        // 是否允许查询里番
        const isAllowAnimeType4 = [
            ADMIN,
            ANIEM_TYPE_4_PERMISSION.permission
        ].some(p => permissions.includes(p));

        // 获取当前用户的行为数据
        const userBehaviors = await elastic.search({
            index: 'user_behavior_index',
            body: {
                query: {bool: {must: [{term: {userId: userId}}]}},
                size: 1000
            }
        });

        if (!userBehaviors.hits.hits.length) {
            // 没有行为，返回空
            return {rows: [], total: 0};
        }

        // 获取用户交互过的动漫ID
        const userAnimeIds = [
            ...new Set(userBehaviors.hits.hits.map(hit => hit._source.animeId))
        ];

        // 找到与当前用户有相似行为的用户
        const similarUsers = await elastic.search({
            index: 'user_behavior_index',
            body: {
                query: {
                    bool: {
                        must: [
                            {terms: {animeId: userAnimeIds}},
                            {bool: {must_not: [{term: {userId: userId}}]}}
                        ]
                    }
                },
                aggs: {
                    similar_users: {
                        terms: {
                            field: 'userId',
                            size: 50,
                            order: {_count: 'desc'}
                        },
                        aggs: {
                            similarity_score: {
                                sum: {
                                    field: 'weight'
                                }
                            }
                        }
                    }
                },
                size: 0
            }
        });

        const similarUserBuckets =
            similarUsers.aggregations.similar_users.buckets;

        if (!similarUserBuckets.length) {
            // 没有相似用户，返回空
            return {rows: [], total: 0};
        }

        // 获取相似用户ID（按相似度排序）
        const similarUserIds = similarUserBuckets.map(bucket => bucket.key);

        // 获取相似用户的行为数据（排除当前用户已交互的动漫）
        const similarUserBehaviors = await elastic.search({
            index: 'user_behavior_index',
            body: {
                query: {bool: {must: [{terms: {userId: similarUserIds}}]}},
                size: 1000
            }
        });

        // 统计动漫出现频率（评分、收藏、历史都算，评分高权重更高）
        const animeScoreMap = {};

        similarUserBehaviors.hits.hits.forEach(hit => {
            const {animeId, weight, userId} = hit._source;

            // 找到该用户的相似度分数
            const userSimilarity =
                similarUserBuckets.find(bucket => bucket.key === userId)
                    ?.similarity_score.value || 1;

            // 计算加权分数
            const weightedScore = weight * userSimilarity;

            animeScoreMap[animeId] =
                (animeScoreMap[animeId] || 0) + weightedScore;
        });

        const sortedAnimeIds = Object.entries(animeScoreMap)
            .sort((a, b) => b[1] - a[1])
            .map(([animeId]) => animeId);

        if (!sortedAnimeIds.length) {
            // 没有动漫，返回空
            return {rows: [], total: 0};
        }

        // 从动漫索引获取推荐结果
        const from = (page - 1) * pageSize;
        const queryBody = {
            index: 'anime_index',
            body: {
                query: {
                    bool: {
                        must: [
                            {terms: {id: sortedAnimeIds.slice(0, 2000)}} // 限制前2000个
                        ]
                    }
                },
                sort: [
                    {
                        _script: {
                            type: 'number',
                            script: {
                                source: `
                                def animeId = doc['id'].value.toString();
                                def scores = params.scores;
                                return scores.containsKey(animeId) ? scores.get(animeId) : 0;
                            `,
                                params: {
                                    scores: animeScoreMap
                                }
                            },
                            order: 'desc'
                        }
                    }
                ],
                _source: [
                    'id',
                    'name',
                    'remark',
                    'bannerUrl',
                    'status',
                    'videoCount',
                    'videoId'
                ],
                from: from,
                size: pageSize
            }
        };

        if (isAllowAnimeType4) {
            queryBody.body.query.bool.must_not = [{term: {type: 4}}];
        }
        const recommendationResult = await elastic.search(queryBody);

        const total = sortedAnimeIds.length;
        const rows = await this.formatAnime(
            recommendationResult.hits.hits,
            userId
        );

        return {rows, total};
    }

    /**
     * @title 获取视频详情
     * @param {string} userId 当前用户ID
     * @param {string} videoId 视频ID
     */
    static async detail({userId, videoId}) {
        try {
            // 检查视频是否存在
            const video = await VideoDao.findById(videoId, {
                id: true,
                animeId: true,
                episode: true,
                url: true,
                title: true
            });
            if (!video) throw new NotFound('视频不存在');

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {bool: {must: [{term: {id: video.animeId}}]}},
                    size: 1,
                    _source: [
                        'name',
                        'description',
                        'status',
                        'videoCount',
                        'playCount',
                        'collectionCount',
                        'averageRating'
                    ]
                }
            };

            const animes = await elastic.search(queryBody);

            if (!animes.hits.hits.length) throw new NotFound('动漫不存在');

            // 用户是否评分
            const isRating = await AnimeRatingDao.findByUserAndAnime(
                userId,
                video.animeId
            );

            // 获取视频数量
            const {rows} = await VideoDao.list({
                where: {animeId: video.animeId},
                select: {id: true, episode: true, title: true},
                orderBy: {episode: 'asc'}
            });

            // 用户是否追番
            const isCollected = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                video.animeId
            );

            // 播放历史
            const history = await VideoHistoryDao.findFirst({
                where: {userId, videoId},
                select: {time: true}
            });

            const anime = animes.hits.hits[0]._source;

            return {
                ...anime,
                time: history?.time ? history.time : undefined,
                video,
                videoList: rows,
                isCollected: !!isCollected,
                isRating: !!isRating
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 获取动漫推荐
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async recommend({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const animes = await elastic.search({
                index: 'anime_index',
                body: {
                    query: {term: {id: animeId}},
                    size: 1,
                    _source: ['type', 'tags', 'director', 'cv', 'year']
                }
            });
            if (!animes.hits.hits.length) throw new NotFound('动漫不存在');

            const anime = animes.hits.hits[0]._source;
            const tags = anime.tags || [];

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {
                        function_score: {
                            query: {
                                bool: {
                                    must: [
                                        {term: {type: anime.type}},
                                        {
                                            bool: {
                                                must_not: [
                                                    {term: {id: animeId}}
                                                ]
                                            }
                                        }
                                    ],
                                    should: [
                                        // 标签匹配 - 权重最高
                                        {
                                            terms: {
                                                tags: tags,
                                                boost: 5.0
                                            }
                                        },
                                        // 同导演
                                        anime.director
                                            ? {
                                                  match: {
                                                      director: {
                                                          query: anime.director,
                                                          boost: 2.5
                                                      }
                                                  }
                                              }
                                            : null,
                                        // 同声优 (模糊匹配)
                                        anime.cv
                                            ? {
                                                  match: {
                                                      cv: {
                                                          query: anime.cv,
                                                          boost: 1.0
                                                      }
                                                  }
                                              }
                                            : null, // 年份接近
                                        anime.year
                                            ? {
                                                  range: {
                                                      year: {
                                                          gte: anime.year - 1,
                                                          lte: anime.year + 1,
                                                          boost: 1.0
                                                      }
                                                  }
                                              }
                                            : null
                                    ].filter(Boolean)
                                }
                            },
                            score_mode: 'sum',
                            boost_mode: 'multiply'
                        }
                    }
                },
                size: 10,
                _source: [
                    'id',
                    'name',
                    'bannerUrl',
                    'status',
                    'collectionCount',
                    'videoCount',
                    'averageRating',
                    'playCount',
                    'videoId'
                ],
                sort: [{_score: 'desc'}, {updatedAt: 'desc'}]
            };

            const recommendAnimes = await elastic.search(queryBody);

            const total = recommendAnimes.hits.hits.length;
            const rows = await this.formatAnime(
                recommendAnimes.hits.hits,
                userId
            );

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 获取热门动漫排行
     * @param {string} userId 当前用户ID
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string[]} permissions 当前用户权限
     */
    static async hotRank({page = 1, pageSize = 10, userId, permissions}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {
                        bool: {
                            must_not: isAllowAnimeType4
                                ? []
                                : [{term: {type: 4}}]
                        }
                    },
                    sort: [
                        {
                            _script: {
                                type: 'number',
                                script: {
                                    source: `
                                        def playScore = doc['playCount'].value * 0.5;
                                        def ratingScore = doc['ratingCount'].value * 0.3;
                                        def collectionScore = doc['collectionCount'].value * 0.2;
                                        return playScore + ratingScore + collectionScore;
                                    `,
                                    lang: 'painless'
                                },
                                order: 'desc'
                            }
                        }
                    ],
                    from: (page - 1) * pageSize,
                    size: pageSize,
                    _source: [
                        'id',
                        'name',
                        'remark',
                        'coverUrl',
                        'status',
                        'videoCount',
                        'videoId'
                    ]
                }
            };

            // 获取总数
            const counts = await elastic.search({
                index: 'anime_index',
                body: {query: queryBody.body.query, size: 0}
            });

            // 获取数据
            const animes = await elastic.search(queryBody);

            const total = counts.hits.total.value;
            const rows = await this.formatAnime(animes.hits.hits, userId);

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @tital 获取动漫搜索建议
     * @param {string} keyword 搜索词
     * @param {string[]} permissions 当前用户权限
     */
    static async suggest({keyword, permissions}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            // 检查输入是否是纯拼音（不包含中文）
            const isPinyinOnly = !/[\u4e00-\u9fa5]/.test(keyword);

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    bool: {
                                        should: [
                                            // 名称匹配
                                            {
                                                match: {
                                                    name: {
                                                        query: keyword,
                                                        operator: 'and',
                                                        boost: isPinyinOnly
                                                            ? 1.0
                                                            : 2.0
                                                    }
                                                }
                                            },
                                            // 拼音全拼匹配
                                            {
                                                match: {
                                                    'name.pinyin': {
                                                        query: keyword,
                                                        operator: 'and',
                                                        boost: 1.5
                                                    }
                                                }
                                            },
                                            // 首字母缩写匹配 - 使用 match_phrase_prefix
                                            {
                                                match_phrase_prefix: {
                                                    'name.initials': {
                                                        query: keyword,
                                                        boost: 1.0
                                                    }
                                                }
                                            }
                                        ],
                                        minimum_should_match: 1
                                    }
                                }
                            ],
                            must_not: isAllowAnimeType4
                                ? []
                                : [{term: {type: 4}}] // 如果是纯拼音，增加拼音字段的权重
                        }
                    },
                    highlight: {
                        fields: {
                            name: {type: 'plain'}
                        },
                        pre_tags: ['<em>'],
                        post_tags: ['</em>']
                    },
                    size: 10,
                    _source: ['name']
                }
            };

            // 获取数据
            const suggests = await elastic.search(queryBody);

            const rows = suggests.hits.hits.map(hit => {
                const name = hit.highlight?.name
                    ? hit.highlight.name[0]
                    : hit._source.name;

                return {
                    name: hit._source.name,
                    highlightName: name
                };
            });
            const total = rows.length;

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 格式化es的动漫
     */
    static async formatAnime(list, userId) {
        if (!list.length) return [];
        // 获取用户观看历史（用于确定videoId）
        const userHistories = await VideoHistoryDao.findByUserId(userId);
        const userHistoryMap = new Map();
        userHistories.forEach(history => {
            userHistoryMap.set(history.animeId, history.videoId);
        });

        // 处理ES返回的动漫数据
        const data = list.map(hit => {
            const anime = hit._source;

            // 确定videoId：优先使用用户观看历史，否则使用默认videoId
            let videoId = anime.videoId;
            if (userHistoryMap.has(anime.id)) {
                videoId = userHistoryMap.get(anime.id);
            }

            return {
                ...anime,
                videoId: videoId
            };
        });

        return data;
    }
}

module.exports = AnimeService;
