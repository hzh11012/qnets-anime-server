const AnimeCollectionDao = require('@dao/anime-collection');
const AnimeDao = require('@dao/anime');
const VideoHistoryDao = require('@dao/video-history');
const {NotFound, Existing} = require('@core/http-exception');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const elastic = require('@core/es');

class AnimeCollectionService {
    /**
     * @title 首页我的追番
     * @param {string[]} id 当前用户ID
     * @param {string[]} permissions 当前用户权限
     */
    static async options({permissions, id}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const {rows: collections, total} = await AnimeCollectionDao.list({
                where: isAllowAnimeType4
                    ? {userId: id}
                    : {userId: id, anime: {type: {not: 4}}},
                select: {animeId: true},
                orderBy: {createdAt: 'desc'},
                take: 5
            });

            const animeIds = collections.map(item => item.animeId);
            if (!animeIds.length) {
                return {total: 0, rows: []};
            }

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {bool: {must: [{terms: {id: animeIds}}]}},
                    sort: [
                        {
                            _script: {
                                type: 'number',
                                script: {
                                    source: `
                                        def order = ['${animeIds.join("','")}'];
                                        def index = order.indexOf(doc['id'].value);
                                        return index >= 0 ? index : 999;
                                    `,
                                    lang: 'painless'
                                },
                                order: 'asc'
                            }
                        }
                    ],
                    size: animeIds.length,
                    _source: [
                        'id',
                        'name',
                        'bannerUrl',
                        'status',
                        'videoCount',
                        'videoId'
                    ]
                }
            };

            const animes = await elastic.search(queryBody);

            if (!animes.hits.hits.length) {
                return {total: 0, rows: []};
            }

            // 获取用户观看历史（用于确定videoId）
            const userHistories = await VideoHistoryDao.findMany({
                where: {userId: id, animeId: {in: animeIds}},
                select: {
                    animeId: true,
                    videoId: true,
                    time: true,
                    video: {select: {episode: true}}
                },
                orderBy: {updatedAt: 'desc'}
            });

            const animeMap = new Map();

            animes.hits.hits.forEach(hit => {
                const {id, ...anime} = hit._source;
                animeMap.set(id, anime);
            });

            const rows = userHistories.map(history => {
                const {animeId, video, ...rest} = history;
                const anime = animeMap.get(animeId);

                return {
                    episode: video.episode,
                    id: animeId,
                    ...anime,
                    ...rest
                };
            });

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 我的追番
     * @param {string[]} id 当前用户ID
     * @param {string[]} permissions 当前用户权限
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     */
    static async list({id, permissions, page = 1, pageSize = 10}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const {rows: collections, total} = await AnimeCollectionDao.list({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {createdAt: 'desc'},
                where: {
                    userId: id,
                    anime: isAllowAnimeType4 ? undefined : {type: {not: 4}}
                },
                select: {animeId: true, createdAt: true}
            });

            const animeIds = collections.map(item => item.animeId);

            if (!animeIds.length) {
                return {total: 0, rows: []};
            }

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {bool: {must: [{terms: {id: animeIds}}]}},
                    sort: [
                        {
                            _script: {
                                type: 'number',
                                script: {
                                    source: `
                                        def order = ['${animeIds.join("','")}'];
                                        def index = order.indexOf(doc['id'].value);
                                        return index >= 0 ? index : 999;
                                    `,
                                    lang: 'painless'
                                },
                                order: 'asc'
                            }
                        }
                    ]
                },
                size: animeIds.length,
                _source: [
                    'id',
                    'name',
                    'remark',
                    'coverUrl',
                    'status',
                    'videoCount',
                    'videoId'
                ]
            };

            // 获取数据
            const animes = await elastic.search(queryBody);

            if (!animes.hits.hits.length) {
                return {total: 0, rows: []};
            }

            const rows = await this.formatAnime(animes.hits.hits, id);

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 追番
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async create({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(animeId);
            if (!anime) throw new NotFound('动漫不存在');

            // 检查我的追番中该动漫是否存在
            const existing = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                animeId
            );
            if (existing) throw new Existing('动漫已追番');

            const data = {userId, animeId};

            return await AnimeCollectionDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 取消追番
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async delete({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(animeId);
            if (!anime) throw new NotFound('动漫不存在');

            // 检查我的追番中该动漫是否存在
            const existing = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                animeId
            );

            if (!existing) throw new NotFound('动漫未追番');

            return await AnimeCollectionDao.deleteByUserAndAnime(
                userId,
                animeId
            );
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
        const data = list
            .map(hit => {
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
            })
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return data;
    }
}

module.exports = AnimeCollectionService;
