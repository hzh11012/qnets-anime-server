const VideoDao = require('@dao/video');
const VideoHistoryDao = require('@dao/video-history');
const {NotFound} = require('@core/http-exception');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const elastic = require('@core/es');

class VideoHistoryService {
    /**
     * @title 保存历史播放记录
     * @param {string} userId - 当前用户ID
     * @param {string} id - 视频ID
     * @param {string} aniemId - 动漫ID
     * @param {number} time - 视频进度时间
     */
    static async create({userId, id, animeId, time}) {
        try {
            // 检查视频是否存在
            const video = await VideoDao.findByIdAndAnimeId(id, animeId);
            if (!video) throw new NotFound('视频不存在');

            const history = await VideoHistoryDao.findByUserIdAndAnimeId(
                userId,
                animeId
            );

            if (history) {
                // 存在历史记录则更新
                return await VideoHistoryDao.update(history.id, {
                    time,
                    videoId: id
                });
            } else {
                // 不存在历史记录则新建
                return await VideoHistoryDao.create({
                    userId,
                    animeId,
                    videoId: id,
                    time
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 历史记录
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

            const {rows: histories, total} = await VideoHistoryDao.list({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {updatedAt: 'desc'},
                where: {
                    userId: id,
                    anime: isAllowAnimeType4 ? undefined : {type: {not: 4}}
                },
                select: {
                    animeId: true,
                    time: true,
                    videoId: true,
                    updatedAt: true,
                    video: {
                        select: {
                            title: true,
                            episode: true
                        }
                    }
                }
            });

            const animeIds = histories.map(item => item.animeId);

            if (!animeIds.length) {
                return {total: 0, rows: []};
            }

            const historyMap = new Map();
            histories.forEach(history => {
                const {animeId, ...rest} = history;
                historyMap.set(history.animeId, rest);
            });

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
                _source: ['id', 'name', 'bannerUrl']
            };

            // 获取数据
            const animes = await elastic.search(queryBody);

            if (!animes.hits.hits.length) {
                return {total: 0, rows: []};
            }

            const rows = animes.hits.hits
                .map(hit => {
                    const anime = hit._source;

                    if (historyMap.has(anime.id)) {
                        return {
                            ...anime,
                            ...historyMap.get(anime.id)
                        };
                    }

                    return null;
                })
                .filter(item => item);

            return {rows, total};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VideoHistoryService;
