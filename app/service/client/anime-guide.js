const AnimeGuideDao = require('@dao/anime-guide');
const VideoHistoryDao = require('@dao/video-history');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const elastic = require('@core/es');

class AnimeGuideService {
    /**
     * @title 新番导视列表
     * @param {string} userId 当前用户ID
     * @param {string[]} permissions 当前用户权限
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {number} updateDay - 更新日期 0-6 分别对应周日到周六
     */
    static async list({
        userId,
        permissions,
        page = 1,
        pageSize = 10,
        updateDay
    }) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const {rows: guides} = await AnimeGuideDao.list({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {updateTime: 'asc'},
                where: {
                    updateDay,
                    anime: isAllowAnimeType4 ? undefined : {type: {not: 4}}
                },
                select: {animeId: true, updateTime: true}
            });

            const guideMap = new Map();
            const animeIds = guides.map(item => {
                guideMap.set(item.animeId, item.updateTime);
                return item.animeId;
            });

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
                    'coverUrl',
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
                    videoId: videoId,
                    updateTime: guideMap.get(anime.id)
                };
            });

            return {total, rows};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeGuideService;
