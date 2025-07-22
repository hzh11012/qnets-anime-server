const NoticeDao = require('@dao/notice');

class NoticeService {
    /**
     * @title 公告列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     */
    static async list({page = 1, pageSize = 10}) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {status: 1},
                orderBy: {createdAt: 'desc'},
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true
                }
            };

            return await NoticeDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NoticeService;
