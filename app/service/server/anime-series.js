const AnimeSeriesDao = require('@dao/anime-series');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeSeriesService {
    /**
     * @title 动漫系列创建
     * @param {string} name 系列名称
     */
    static async create({name}) {
        try {
            // 检查动漫系列是否存在
            const existing = await AnimeSeriesDao.findByName(name);
            if (existing) throw new Existing('动漫系列已存在');

            const data = {name};

            return await AnimeSeriesDao.create(data);
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
            const existing = await AnimeSeriesDao.findByIdWithRelations(id);
            if (!existing) throw new NotFound('动漫系列不存在');

            if (existing.animes.length)
                throw new Existing('无法删除：动漫系列存在关联动漫');

            return await AnimeSeriesDao.delete(id);
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
                    animes: {select: {name: true}}
                },
                omit: {updatedAt: true}
            };

            return await AnimeSeriesDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫系列选项
     */
    static async options() {
        try {
            const params = {
                select: {id: true, name: true},
                orderBy: {createdAt: 'desc'}
            };

            const result = await AnimeSeriesDao.list(params);

            return result.rows.map(item => ({
                label: item.name,
                value: item.id
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeSeriesService;
