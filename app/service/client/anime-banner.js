const AnimeBannerDao = require('@dao/anime-banner');
const VideoHistoryDao = require('@dao/video-history');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const elastic = require('@core/es');

class AnimeBannerService {
    /**
     * @title 首页轮播
     * @param {string} userId 当前用户ID
     * @param {string[]} permissions 当前用户权限
     */
    static async options({permissions, userId}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const {rows: banners} = await AnimeBannerDao.list({
                take: 7,
                orderBy: {createdAt: 'desc'},
                where: isAllowAnimeType4 ? {} : {anime: {type: {not: 4}}},
                select: {animeId: true}
            });

            const animeIds = banners.map(item => item.animeId);

            if (!animeIds.length) {
                return {total: 0, rows: []};
            }

            const queryBody = {
                index: 'anime_index',
                body: {
                    query: {bool: {must: [{terms: {id: animeIds}}]}}
                },
                size: animeIds.length,
                _source: [
                    'id',
                    'name',
                    'bannerUrl',
                    'status',
                    'videoCount',
                    'videoId'
                ]
            };

            const animes = await elastic.search(queryBody);

            if (!animes.hits.hits.length) {
                return {total: 0, rows: []};
            }

            // 获取用户观看历史（用于确定videoId）
            const userHistories = await VideoHistoryDao.findMany({
                where: {userId, animeId: {in: animeIds}},
                select: {animeId: true, videoId: true}
            });
            const userHistoryMap = new Map();
            userHistories.forEach(history => {
                userHistoryMap.set(history.animeId, history.videoId);
            });

            const total = animes.hits.hits.length;
            const rows = animes.hits.hits.map(hit => {
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

            return {total, rows};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeBannerService;
