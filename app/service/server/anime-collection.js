const AnimeCollectionDao = require('@dao/anime-collection');
const {NotFound} = require('@core/http-exception');

class AnimeCollectionService {
    /**
     * @title 动漫收藏删除
     * @param {string} id 收藏ID
     */
    static async delete({id}) {
        try {
            const existing = await AnimeCollectionDao.findById(id);
            if (!existing) throw new NotFound('动漫收藏不存在');

            return await AnimeCollectionDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫收藏列表
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
                where.user = {
                    nickname: keyword ? {contains: keyword} : undefined
                };
            } else if (type === 'animeName') {
                where.anime = {
                    name: keyword ? {contains: keyword} : undefined
                };
            }
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where,
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    user: {select: {nickname: true, email: true}},
                    anime: {select: {name: true, coverUrl: true}}
                },
                omit: {updatedAt: true}
            };

            return await AnimeCollectionDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeCollectionService;
