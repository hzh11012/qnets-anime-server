const AnimeDao = require('@dao/anime');
const VideoDao = require('@dao/video');
const {NotFound} = require('@core/http-exception');

class AnimeSeries {
    /**
     * @title 动漫系列
     * @param {string} userId 当前用户ID
     * @param {string} id 动漫ID
     */
    static async list({userId, id}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(id, {animeSeriesId: true});
            if (!anime) throw new NotFound('动漫不存在');

            const params = {
                where: {id: {not: id}, animeSeriesId: anime.animeSeriesId},
                orderBy: [{season: 'asc'}],
                select: {
                    id: true,
                    name: true,
                    seasonName: true,
                    coverUrl: true,
                    status: true,
                    _count: {select: {videos: true, animeCollections: true}},
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

            const animeIds = rows.map(item => item.id);
            const playCounts =
                await VideoDao.getTotalPlayCountByAnimeIds(animeIds);
            const playCountMap = {};
            playCounts.forEach(r => {
                playCountMap[r.animeId] = r.playCount;
            });

            const data = rows.map(
                ({
                    _count,
                    videoHistories,
                    videos,
                    name,
                    id,
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
                        playCount: playCountMap[id] || 0,
                        videoId
                    };
                }
            );

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeSeries;
