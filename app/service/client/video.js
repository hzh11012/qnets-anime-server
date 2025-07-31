const VideoDao = require('@dao/video');
const {NotFound} = require('@core/http-exception');
const redis = require('@core/redis');

class VideoService {
    /**
     * @title 添加播放量
     * @param {string} userId - 当前用户ID
     * @param {string} id - 视频ID
     */
    static async incrementPlayCount({userId, id}) {
        try {
            const key = `video:play:${id}:user:${userId}`;

            // 检查是否已加过
            const exists = await redis.get(key);
            if (exists) return null;

            // 检查视频是否存在
            const video = await VideoDao.findById(id);
            if (!video) throw new NotFound('视频不存在');

            // 同视频24小时内不能重复刷播放量
            await redis.set(key, 1, 24 * 60 * 60);

            return await VideoDao.update(id, {
                playCount: (video.playCount || 0) + 1
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VideoService;
