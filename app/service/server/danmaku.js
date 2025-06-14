const DanmakuDao = require('@dao/danmaku');
const {NotFound} = require('@core/http-exception');

class DanmakuService {
    /**
     * @title 弹幕删除
     * @param {string} id 弹幕ID
     */
    static async delete({id}) {
        try {
            const existing = await DanmakuDao.findById(id);
            if (!existing) throw new NotFound('弹幕不存在');

            return await DanmakuDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 弹幕列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} modes - 弹幕模式 0-滚动(默认) 1-顶部 2-底部 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'text',
        modes = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            let where = {
                mode: modes.length ? {in: modes} : undefined
            };
            if (type === 'nickname') {
                where.user = {
                    nickname: keyword ? {contains: keyword} : undefined
                };
            } else if (type === 'animeName') {
                where.video = {
                    anime: {name: keyword ? {contains: keyword} : undefined}
                };
            } else {
                where[type] = keyword ? {contains: keyword} : undefined;
            }

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where,
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    user: {select: {nickname: true, avatar: true}},
                    video: {
                        select: {episode: true, anime: {select: {name: true}}}
                    }
                },
                omit: {updatedAt: true, userId: true, videoId: true}
            };

            return await DanmakuDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DanmakuService;
