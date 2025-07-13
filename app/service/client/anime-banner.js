const AnimeBannerDao = require('@dao/anime-banner');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');

class AnimeBannerService {
    /**
     * @title 首页轮播
     * @param {string[]} permissions 当前用户权限
     */
    static async options({permissions, userId}) {
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
                            _count: {select: {videos: true}},
                            videoHistories: {
                                where: {userId},
                                select: {videoId: true}
                            },
                            videos: {
                                take: 1,
                                orderBy: {episode: 'asc'},
                                select: {id: true}
                            }
                        }
                    }
                },
                omit: {createdAt: true, updatedAt: true}
            };

            const {rows, total} = await AnimeBannerDao.list(params);

            const data = rows.map(({animeId, anime}) => {
                const {videoHistories, videos, _count, ...rest} = anime;

                let videoId = videos[0]?.id || undefined;

                if (videoHistories.length) {
                    videoId = videoHistories[0]?.videoId;
                }

                return {
                    id: animeId,
                    videoId,
                    videoCount: _count.videos,
                    ...rest
                };
            });

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeBannerService;
