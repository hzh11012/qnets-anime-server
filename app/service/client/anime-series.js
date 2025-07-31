const VideoHistoryDao = require('@dao/video-history');
const {NotFound} = require('@core/http-exception');
const elastic = require('@core/es');

class AnimeSeries {
    /**
     * @title 动漫系列
     * @param {string} userId 当前用户ID
     * @param {string} id 动漫ID
     */
    static async list({userId, id}) {
        try {
            // 检查动漫是否存在
            const animes = await elastic.search({
                index: 'anime_index',
                body: {
                    query: {term: {id}},
                    size: 1,
                    _source: ['seriesId']
                }
            });
            if (!animes.hits.hits.length) throw new NotFound('动漫不存在');

            const anime = animes.hits.hits[0]._source;

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {
                        bool: {
                            must: [
                                {term: {seriesId: anime.seriesId}},
                                {bool: {must_not: [{term: {id}}]}}
                            ]
                        }
                    }
                },
                size: 1000,
                _source: [
                    'id',
                    'name',
                    'bannerUrl',
                    'status',
                    'collectionCount',
                    'videoCount',
                    'playCount',
                    'videoId'
                ],
                sort: [{season: 'asc'}]
            };

            const seriesAnimes = await elastic.search(queryBody);

            const total = seriesAnimes.hits.hits.length;
            const rows = await this.formatAnime(seriesAnimes.hits.hits, userId);

            return {total, rows};
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

module.exports = AnimeSeries;
