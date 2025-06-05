const AnimeRatingDao = require('@dao/anime-rating');
const {NotFound} = require('@core/http-exception');

class AnimeRatingService {
    /**
     * @title 动漫评分删除
     * @param {string} id 评分ID
     */
    static async delete({id}) {
        try {
            const existing = await AnimeRatingDao.findById(id);
            if (!existing) throw new NotFound('动漫评分不存在');

            return await AnimeRatingDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫评分列表
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
        type = 'userName',
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            let where = {};

            if (type === 'userName') {
                where.user = {
                    name: keyword ? {contains: keyword} : undefined
                };
            } else if (type === 'animeName') {
                where.anime = {
                    name: keyword ? {contains: keyword} : undefined
                };
            } else {
                where = {
                    [type]: keyword ? {contains: keyword} : undefined
                };
            }

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where,
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    user: {select: {username: true}},
                    anime: {select: {name: true, coverUrl: true}}
                },
                omit: {updatedAt: true}
            };

            return await AnimeRatingDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫评分编辑
     * @param {string} id 评分ID
     * @param {number} score 评分分数
     * @param {string} content 评分内容
     */
    static async edit({id, score, content}) {
        try {
            const existing = await AnimeRatingDao.findById(id);
            if (!existing) throw new NotFound('动漫评分不存在');

            const data = {score, content};
            return await AnimeRatingDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeRatingService;
