const AnimeTagDao = require('@dao/anime-tag');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeTagService {
    /**
     * @title 动漫分类创建
     * @param {string} name 分类名称
     */
    static async create({name}) {
        try {
            // 检查动漫分类是否存在
            const existing = await AnimeTagDao.findByName(name);
            if (existing) throw new Existing('动漫分类已存在');

            const data = {name};

            return await AnimeTagDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫分类删除
     * @param {string} id 分类ID
     */
    static async delete({id}) {
        try {
            // 检查动漫分类及其关联
            const existing = await AnimeSeriesDao.findByIdWithRelations(id);
            if (!existing) throw new NotFound('动漫分类存在');

            if (existing.anime.length)
                throw new Existing('无法删除：动漫分类存在关联动漫');

            return await AnimeSeriesDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫分类列表
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
        type = 'name',
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {[type]: {contains: keyword}},
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    animes: {select: {name: true}}
                },
                omit: {updatedAt: true}
            };

            return await AnimeTagDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeTagService;
