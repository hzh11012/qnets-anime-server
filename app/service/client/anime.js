const AnimeDao = require('@dao/anime');
const AnimeRatingDao = require('@dao/anime-rating');
const AnimeCollectionDao = require('@dao/anime-collection');
const VideoHistoryDao = require('@dao/video-history');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const {Forbidden} = require('@core/http-exception');

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

            const params = {
                take: 7,
                orderBy: [{year: 'desc'}, {month: 'desc'}, {updatedAt: 'desc'}],
                where: {type},
                select: {
                    id: true,
                    name: true,
                    remark: true,
                    coverUrl: true,
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
            };

            const {rows, total} = await AnimeDao.list(params);

            const data = rows.map(
                ({_count, videoHistories, videos, ...rest}) => {
                    let videoId = videos[0]?.id || undefined;

                    if (videoHistories.length) {
                        videoId = videoHistories[0]?.videoId;
                    }

                    return {
                        ...rest,
                        videoCount: _count.videos,
                        videoId
                    };
                }
            );

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }

    /**
     * 综合评分、追番、历史记录的协同过滤推荐
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} userId 当前用户ID
     */
    static async guessYouLike({page = 1, pageSize = 10, userId}) {
        // 获取用户行为动漫ID
        const [myRatings, myCollections, myHistories] = await Promise.all([
            AnimeRatingDao.findByUserId(userId),
            AnimeCollectionDao.findByUserId(userId),
            VideoHistoryDao.findByUserId(userId)
        ]);

        const myAnimeIds = [
            ...myRatings.map(r => r.animeId),
            ...myCollections.map(c => c.animeId),
            ...myHistories.map(h => h.animeId)
        ];

        if (!myAnimeIds.length) {
            // 没有行为，返回热门动漫
            return this.popular({userId, page, pageSize});
        }

        // 找出兴趣相似用户
        const allRatings = await AnimeRatingDao.findByAnimeIds(myAnimeIds);
        const similarUserIds = [
            ...new Set(
                allRatings.filter(r => r.userId !== userId).map(r => r.userId)
            )
        ];

        if (!similarUserIds.length) {
            // 没有相似用户，返回热门动漫
            return this.popular({userId, page, pageSize});
        }

        // 获取这些相似用户评分、收藏、历史的所有动漫
        const [
            similarUserRatings,
            similarUserCollections,
            similarUserHistories
        ] = await Promise.all([
            AnimeRatingDao.findByUserIds(similarUserIds),
            AnimeCollectionDao.findByUserIds(similarUserIds),
            VideoHistoryDao.findByUserIds(similarUserIds)
        ]);

        // 统计动漫出现频率（评分、收藏、历史都算，评分高权重更高）
        const animeScoreMap = {};
        for (const r of similarUserRatings) {
            animeScoreMap[r.animeId] =
                (animeScoreMap[r.animeId] || 0) + r.score;
        }
        for (const c of similarUserCollections) {
            animeScoreMap[c.animeId] = (animeScoreMap[c.animeId] || 0) + 3;
        }
        for (const h of similarUserHistories) {
            animeScoreMap[h.animeId] = (animeScoreMap[h.animeId] || 0) + 1;
        }

        const sortedAnimeIds = Object.entries(animeScoreMap)
            .sort((a, b) => b[1] - a[1])
            .map(([animeId]) => animeId);

        const total = sortedAnimeIds.length;
        const rows = await this.similar({
            ids: sortedAnimeIds,
            userId,
            page,
            pageSize
        });

        return {rows, total};
    }

    static async popular({page, userId, pageSize}) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: [
                    {animeCollections: {_count: 'desc'}},
                    {animeRatings: {_count: 'desc'}},
                    {updatedAt: 'desc'}
                ],
                select: {
                    id: true,
                    name: true,
                    remark: true,
                    bannerUrl: true,
                    status: true,
                    type: true,
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
            };
            // 没有行为，返回热门动漫
            const data = rows.map(
                ({_count, videoHistories, videos, ...rest}) => {
                    let videoId = videos[0]?.id || undefined;

                    if (videoHistories.length) {
                        videoId = videoHistories[0]?.videoId;
                    }

                    return {
                        ...rest,
                        videoCount: _count.videos,
                        videoId
                    };
                }
            );

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }

    static async similar({ids, userId, page, pageSize}) {
        const start = (page - 1) * pageSize;
        const currentIds = ids.slice(start, start + pageSize);

        if (!currentIds.length) return [];

        const params = {
            where: {id: {in: currentIds}},
            select: {
                id: true,
                name: true,
                remark: true,
                bannerUrl: true,
                status: true,
                type: true,
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
        };
        const {rows} = await AnimeDao.list(params);

        // 按ids顺序排序
        const animeMap = {};
        rows.forEach(a => {
            const {_count, videoHistories, videos, ...rest} = a;
            let videoId = videos[0]?.id || undefined;

            if (videoHistories.length) {
                videoId = videoHistories[0]?.videoId;
            }
            animeMap[a.id] = {...rest, videoCount: _count.videos, videoId};
        });
        return currentIds.map(id => animeMap[id]).filter(Boolean);
    }
}

module.exports = AnimeService;
