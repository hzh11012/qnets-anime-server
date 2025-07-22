const DanmakuDao = require('@dao/danmaku');
const VideoDao = require('@dao/video');
const {NotFound} = require('@core/http-exception');

class DanmakuService {
    /**
     * @title 弹幕列表
     * @param {string} id - 视频ID
     */
    static async list({id}) {
        try {
            // 检查视频是否存在
            const existing = await VideoDao.findById(id);
            if (!existing) throw new NotFound('视频不存在');

            const params = {
                where: {videoId: id},
                orderBy: {createdAt: 'desc'},
                omit: {
                    id: true,
                    updatedAt: true,
                    createdAt: true,
                    userId: true,
                    videoId: true
                }
            };

            return await DanmakuDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 弹幕添加
     * @param {string} videoId - 视频ID
     * @param {string} userId - 用户ID
     * @param {number} mode - 弹幕模式 0-滚动(默认) 1-顶部 2-底部
     * @param {string} text - 弹幕内容
     * @param {string} color - 弹幕颜色 (十六进制颜色值)
     * @param {number} time - 视频时间点（秒）
     */
    static async create(data) {
        try {
            return await DanmakuDao.create(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DanmakuService;
