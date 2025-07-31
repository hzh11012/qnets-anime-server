const VideoDao = require('@dao/video');
const VideoHistoryDao = require('@dao/video-history');
const {NotFound} = require('@core/http-exception');

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
}

module.exports = VideoHistoryService;
