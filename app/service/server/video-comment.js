const VideoCommentDao = require('@dao/video-comment');
const {NotFound} = require('@core/http-exception');

class VideoCommentService {
    /**
     * @title 视频评论删除
     * @param {string} id 视频评论ID
     */
    static async delete({id}) {
        try {
            // 检查视频评论是否存在
            const existing = await VideoCommentDao.findById(id);
            if (!existing) throw new NotFound('视频评论不存在');

            if (existing.parentId) {
                await VideoCommentDao.decrementReplyCount(existing.parentId);
            }

            return await VideoCommentDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 视频评论列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 账号状态 0-待审核 1-启用 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'content',
        status = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            let where = {};
            if (type === 'nickname') {
                where = {
                    user: {nickname: keyword ? {contains: keyword} : undefined}
                };
            } else if (type === 'animeName') {
                where = {
                    video: {
                        anime: {name: keyword ? {contains: keyword} : undefined}
                    }
                };
            } else {
                where = {[type]: keyword ? {contains: keyword} : undefined};
            }

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    ...where,
                    status: status.length ? {in: status} : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    user: {select: {nickname: true, avatar: true}},
                    video: {
                        select: {episode: true, anime: {select: {name: true}}}
                    },
                    parent: {select: {content: true}}
                },
                omit: {
                    updatedAt: true,
                    userId: true,
                    videoId: true,
                    parentId: true
                }
            };

            return await VideoCommentDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 视频评论编辑
     * @param {string} id - 视频评论ID
     * @param {number} status 视频评论状态
     * @param {string} content - 视频评论内容
     */
    static async edit({id, content, status}) {
        try {
            // 检查视频评论是否存在
            const existing = await VideoCommentDao.findById(id);
            if (!existing) throw new NotFound('视频评论不存在');

            const data = {content, status};

            return await VideoCommentDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VideoCommentService;
