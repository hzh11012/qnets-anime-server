const AnimeDao = require('@dao/anime');
const AnimeRatingDao = require('@dao/anime-rating');
const AnimeCollectionDao = require('@dao/anime-collection');
const VideoHistoryDao = require('@dao/video-history');
const VideoDao = require('@dao/video');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const {Forbidden, NotFound} = require('@core/http-exception');

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
                    seasonName: true,
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
                ({
                    _count,
                    videoHistories,
                    videos,
                    name,
                    seasonName,
                    ...rest
                }) => {
                    let videoId = videos[0]?.id || undefined;

                    if (videoHistories.length) {
                        videoId = videoHistories[0]?.videoId;
                    }

                    return {
                        ...rest,
                        name: (name + ' ' + seasonName).trim(),
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
     * @title 综合评分、追番、历史记录的协同过滤推荐
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

    /**
     * @title 获取视频详情
     * @param {string} userId 当前用户ID
     * @param {string} videoId 视频ID
     */
    static async detail({userId, videoId}) {
        try {
            // 检查视频是否存在
            const video = await VideoDao.findById(videoId, {
                animeId: true,
                episode: true,
                url: true,
                title: true
            });
            if (!video) throw new NotFound('视频不存在');

            const anime = await AnimeDao.findById(video.animeId, {
                name: true,
                seasonName: true,
                status: true,
                description: true
            });
            if (!anime) throw new NotFound('动漫不存在');

            // 用户是否评分
            const isRating = await AnimeRatingDao.findByUserAndAnime(
                userId,
                video.animeId
            );

            // 获取视频数量
            const {rows, total} = await VideoDao.list({
                where: {animeId: video.animeId},
                select: {id: true, episode: true, title: true},
                orderBy: {episode: 'asc'}
            });

            // 用户是否追番
            const isCollected = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                video.animeId
            );

            // 平均评分
            const avgRating = await AnimeRatingDao.getAvgRating(video.animeId);

            // 播放量
            const playCount = await VideoDao.getTotalPlayCountByAnimeId(
                video.animeId
            );

            // 收藏量
            const collectionCount = await AnimeCollectionDao.countByAnimeId(
                video.animeId
            );

            // 播放历史
            const history = await VideoHistoryDao.find({
                where: {userId, videoId},
                select: {time: true}
            });

            const {name, seasonName, ...rest} = anime;

            return {
                anime: {
                    ...rest,
                    name: (name + ' ' + seasonName).trim()
                },
                video,
                videoList: rows,
                rating: isRating ? isRating.score : undefined,
                isCollected: !!isCollected,
                avgRating,
                playCount,
                videoCount: total,
                time: history?.time ? history.time : undefined,
                collectionCount
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 获取动漫推荐
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async recommend({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(animeId, {
                type: true,
                animeTags: true,
                animeSeriesId: true,
                director: true,
                cv: true,
                year: true
            });
            if (!anime) throw new NotFound('动漫不存在');
            const tags = anime.animeTags.map(tag => tag.id);

            const params = {
                take: 30,
                orderBy: [{updatedAt: 'desc'}],
                where: {
                    id: {not: animeId},
                    type: anime.type,
                    animeTags: {some: {id: {in: tags}}}
                },
                select: {
                    id: true,
                    name: true,
                    remark: true,
                    coverUrl: true,
                    status: true,
                    director: true,
                    seasonName: true,
                    cv: true,
                    year: true,
                    animeSeriesId: true,
                    _count: {select: {videos: true, animeCollections: true}},
                    videoHistories: {
                        where: {userId},
                        select: {videoId: true}
                    },
                    animeTags: {select: {id: true}},
                    videos: {
                        take: 1,
                        orderBy: {episode: 'asc'},
                        select: {id: true}
                    }
                }
            };

            const {rows} = await AnimeDao.list(params);

            const animeIds = rows.map(item => item.id);
            const [avgRatings, playCounts] = await Promise.all([
                AnimeRatingDao.getAvgRatingByAnimeIds(animeIds),
                VideoDao.getTotalPlayCountByAnimeIds(animeIds)
            ]);
            const avgRatingMap = {};
            avgRatings.forEach(r => {
                avgRatingMap[r.animeId] = r.avg;
            });
            const playCountMap = {};
            playCounts.forEach(r => {
                playCountMap[r.animeId] = r.playCount;
            });

            // 计算相似度分数
            const calcScore = item => {
                let score = 0;
                // 标签重合
                const tagMatch = item.animeTags.filter(t =>
                    tags.includes(t.id)
                ).length;
                score += tagMatch * 5; // 权重5

                // 同系列
                if (
                    item.animeSeriesId &&
                    item.animeSeriesId === anime.animeSeriesId
                )
                    score += 3;

                // 同导演
                if (item.director && item.director === anime.director)
                    score += 2;

                // 同声优
                if (
                    item.cv &&
                    anime.cv &&
                    item.cv
                        .split(',')
                        .some(cv => anime.cv.split('/').includes(cv))
                )
                    score += 1;

                // 年份接近
                if (
                    item.year &&
                    anime.year &&
                    Math.abs(item.year - anime.year) <= 1
                )
                    score += 1;

                // 热度加分（收藏数、评分等）
                score += (item._count.animeCollections || 0) * 0.2;
                score += (avgRatingMap[item.id] || 0) * 0.5;

                return score;
            };

            const sortedRows = rows
                .map(item => ({
                    ...item,
                    similarityScore: calcScore(item)
                }))
                .sort((a, b) => b.similarityScore - a.similarityScore)
                .slice(0, 10);

            const data = sortedRows.map(
                ({
                    _count,
                    videoHistories,
                    videos,
                    id,
                    name,
                    seasonName,
                    ...rest
                }) => {
                    let videoId = videos[0]?.id || undefined;

                    if (videoHistories.length) {
                        videoId = videoHistories[0]?.videoId;
                    }

                    return {
                        ...rest,
                        name: (name + ' ' + seasonName).trim(),
                        collectionCount: _count.videos,
                        videoCount: _count.videos,
                        avgRating: avgRatingMap[id] || 0,
                        playCount: playCountMap[id] || 0,
                        videoId
                    };
                }
            );
            return {
                rows: data,
                total: data.length
            };
        } catch (error) {
            throw error;
        }
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
                    seasonName: true,
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
            const {rows, total} = await AnimeDao.list(params);

            // 没有行为，返回热门动漫
            const data = rows.map(
                ({
                    _count,
                    videoHistories,
                    videos,
                    name,
                    seasonName,
                    ...rest
                }) => {
                    let videoId = videos[0]?.id || undefined;

                    if (videoHistories.length) {
                        videoId = videoHistories[0]?.videoId;
                    }

                    return {
                        ...rest,
                        name: (name + ' ' + seasonName).trim(),
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
                seasonName: true,
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
            const {_count, videoHistories, videos, name, seasonName, ...rest} =
                a;
            let videoId = videos[0]?.id || undefined;

            if (videoHistories.length) {
                videoId = videoHistories[0]?.videoId;
            }
            animeMap[a.id] = {
                ...rest,
                name: (name + ' ' + seasonName).trim(),
                videoCount: _count.videos,
                videoId
            };
        });
        return currentIds.map(id => animeMap[id]).filter(Boolean);
    }
}

module.exports = AnimeService;
