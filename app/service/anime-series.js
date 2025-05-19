const AniemSeriesDao = require('@dao/anime-series');
const {NotFound, Existing} = require('@core/http-exception');

class AniemSeriesService {
    /**
     * @title 动漫系列创建
     * @param {string} name 系列名称
     */
    static async create({name}) {
        try {
            // 检查动漫系列是否存在
            const existing = await AniemSeriesDao.findByName(name);
            if (existing) throw new Existing('动漫系列已存在');

            const data = {name};

            return await AniemSeriesDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫系列删除
     * @param {string} id 系列ID
     */
    static async delete({id}) {
        try {
            // 检查动漫系列及其关联
            const existing = await AniemSeriesDao.findByIdWithRelations(id);
            if (!existing) throw new NotFound('动漫系列存在');

            if (existing.anime.length)
                throw new Existing('无法删除：动漫系列存在关联动漫');

            return await AniemSeriesDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫系列列表
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
                    anime: {select: {name: true}}
                },
                omit: {updatedAt: true}
            };

            return await AniemSeriesDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AniemSeriesService;
