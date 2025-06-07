const NoticeDao = require('@dao/notice');
const {NotFound} = require('@core/http-exception');

class NoticeService {
    /**
     * @title 公告创建
     * @param {string} title 公告标题
     * @param {string} content 公告内容
     * @param {number} status 公告状态 0-未发布 1-已发布
     */
    static async create({title, content, status}) {
        try {
            const data = {title, content, status};

            return await NoticeDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 公告删除
     * @param {string} id 公告ID
     */
    static async delete({id}) {
        try {
            // 检查角色及其关联
            const existing = await NoticeDao.findById(id);
            if (!existing) throw new NotFound('公告不存在');

            return await NoticeDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 公告编辑
     * @param {string} id 公告ID
     * @param {string} title 公告标题
     * @param {string} content 公告内容
     * @param {number} status 公告状态 0-未发布 1-已发布
     */
    static async edit({id, title, content, status}) {
        try {
            const existing = await NoticeDao.findById(id);
            if (!existing) throw new NotFound('公告不存在');

            const data = {title, content, status};

            return await NoticeDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 公告列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 公告状态 0-未发布 1-已发布
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'title',
        status = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    [type]: {contains: keyword},
                    status: status.length ? {in: status} : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                omit: {updatedAt: true}
            };

            return await NoticeDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NoticeService;
