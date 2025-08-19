const AnimeTopicDao = require('@dao/anime-topic');
const VideoHistoryDao = require('@dao/video-history');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const {NotFound} = require('@core/http-exception');
const elastic = require('@core/es');

class AnimeTopicService {
    /**
     * @title 首页专题
     * @param {string[]} permissions 当前用户权限
     */
    static async options({permissions}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const params = {
                take: 5,
                orderBy: {updatedAt: 'desc'},
                where: {status: 1},
                select: {
                    id: true,
                    name: true,
                    coverUrl: true,
                    _count: {
                        select: {
                            animes: {
                                where: isAllowAnimeType4 ? {} : {type: {not: 4}}
                            }
                        }
                    }
                }
            };

            const {rows, total} = await AnimeTopicDao.list(params);

            const data = rows.map(({_count, ...rest}) => ({
                ...rest,
                count: _count.animes
            }));

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 专题列表
     * @param {string[]} permissions 当前用户权限
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     */
    static async list({permissions, page = 1, pageSize = 10}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {status: 1},
                orderBy: {updatedAt: 'desc'},
                select: {
                    id: true,
                    name: true,
                    coverUrl: true,
                    _count: {
                        select: {
                            animes: {
                                where: isAllowAnimeType4 ? {} : {type: {not: 4}}
                            }
                        }
                    }
                }
            };

            const {rows, total} = await AnimeTopicDao.list(params);

            const data = rows.map(({_count, ...rest}) => ({
                ...rest,
                count: _count.animes
            }));

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 专题详情
     * @param {string} id 专题ID
     */
    static async detail({id}) {
        try {
            // 检查专题是否存在
            const topic = await AnimeTopicDao.findById(
                id,
                {status: 1},
                {name: true, coverUrl: true, description: true}
            );
            if (!topic) throw new NotFound('专题不存在');

            return {id, ...topic};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 专题详情
     * @param {string} userId 当前用户ID
     * @param {string[]} permissions 当前用户权限
     * @param {string} id 专题ID
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     */
    static async animes({userId, permissions, id, page = 1, pageSize = 10}) {
        try {
            // 检查专题是否存在
            const topic = await AnimeTopicDao.findById(
                id,
                {status: 1},
                {animes: {select: {id: true}}}
            );
            if (!topic) throw new NotFound('专题不存在');

            const animeIds = topic.animes.map(item => item.id);

            if (!animeIds.length) {
                return {total: 0, rows: []};
            }

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
                            must: [{terms: {id: animeIds}}],
                            must_not: isAllowAnimeType4
                                ? []
                                : [{term: {type: 4}}]
                        }
                    }
                },
                from: (page - 1) * pageSize,
                size: pageSize,
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
                _source: [
                    'id',
                    'name',
                    'coverUrl',
                    'status',
                    'videoCount',
                    'videoId'
                ]
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

module.exports = AnimeTopicService;
