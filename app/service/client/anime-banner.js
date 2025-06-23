const AnimeBannerDao = require('@dao/anime-banner');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeBannerService {
    /**
     * @title 首页轮播
     */
    static async options() {
        try {
            const params = {
                take: 7,
                orderBy: {createdAt: 'desc'},
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
