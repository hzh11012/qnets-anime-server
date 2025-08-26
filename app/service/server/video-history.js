const VideoHistoryDao = require('@dao/video-history');
const {NotFound} = require('@core/http-exception');

class VideoHistoryService {
    /**
     * @title 历史播放记录删除
     * @param {string} id 历史播放记录ID
     */
    static async delete({id}) {
        try {
            // 检查历史播放记录是否存在
            const existing = await VideoHistoryDao.findById(id);
            if (!existing) throw new NotFound('历史播放记录不存在');

            return await VideoHistoryDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 历史播放记录列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'nickname',
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            let where = {};
            if (type === 'nickname') {
                where = {
                    user: {nickname: keyword ? {contains: keyword} : undefined}
                };
            } else {
                where = {
                    anime: {name: keyword ? {contains: keyword} : undefined}
                };
            }

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where,
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    user: {select: {nickname: true, avatar: true}},
                    anime: {select: {name: true, seasonName: true}},
                    video: {select: {episode: true}}
                },
                omit: {
                    updatedAt: true,
                    userId: true,
                    animeId: true,
                    videoId: true
                }
            };

            return await VideoHistoryDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VideoHistoryService;
