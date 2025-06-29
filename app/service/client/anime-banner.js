const AnimeBannerDao = require('@dao/anime-banner');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');

class AnimeBannerService {
    /**
     * @title 首页轮播
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
                take: 7,
                orderBy: {createdAt: 'desc'},
                where: isAllowAnimeType4 ? {} : {anime: {type: {not: 4}}},
                include: {
                    anime: {
                        select: {
                            name: true,
                            bannerUrl: true,
                            status: true,
                            _count: {select: {videos: true}}
                        }
                    }
                },
                omit: {createdAt: true, updatedAt: true}
            };

            const {rows, total} = await AnimeBannerDao.list(params);

            const data = rows.map(({animeId, anime}) => ({
                id: animeId,
                name: anime.name,
                bannerUrl: anime.bannerUrl,
                status: anime.status,
                videoCount: anime._count.videos
            }));

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeBannerService;
