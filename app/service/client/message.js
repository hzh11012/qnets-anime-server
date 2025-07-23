const MessageDao = require('@dao/message');

class MessageService {
    /**
     * @title 留言创建
     * @param {string} userId 当前用户ID
     * @param {number} type 留言类型 0-咨询 1-建议 2-投诉 3-其他
     * @param {string} content 留言内容
     */
    static async create({userId, type, content}) {
        try {
            const data = {userId, type, content};

            return await MessageDao.create(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MessageService;
