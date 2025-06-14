const MessageDao = require('@dao/message');
const {NotFound} = require('@core/http-exception');

class MessageService {
    /**
     * @title 留言删除
     * @param {string} id 留言ID
     */
    static async delete({id}) {
        try {
            const existing = await MessageDao.findById(id);
            if (!existing) throw new NotFound('留言不存在');

            return await MessageDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 留言列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 留言状态 留言状态 0-待处理 1-处理中 2-已完成 3-已关闭 [可选]
     * @param {number[]} types - 留言类型 0-咨询 1-建议 2-投诉 3-其他 [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'content',
        status = [],
        types = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    [type]: {contains: keyword},
                    status: status.length ? {in: status} : undefined,
                    type: types.length ? {in: types} : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {user: {select: {nickname: true}}},
                omit: {updatedAt: true, userId: true}
            };

            return await MessageDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 留言编辑
     * @param {string} id 留言ID
     * @param {string} reply 回复内容
     * @param {number} type 留言类型
     * @param {number} status 留言状态
     */
    static async edit({id, reply, type, status}) {
        try {
            const existing = await MessageDao.findById(id);
            if (!existing) throw new NotFound('留言不存在');

            const data = {reply, type, status};

            return await MessageDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MessageService;
