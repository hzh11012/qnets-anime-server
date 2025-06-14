const AnimeDao = require('@dao/anime');
const AnimeSeriesDao = require('@dao/anime-series');
const AnimeTagDao = require('@dao/anime-tag');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeService {
    /**
     * @title 动漫创建
     * @param {string} series 动漫系列ID
     * @param {string} name 动漫名称
     * @param {string} description 动漫简介
     * @param {string} coverUrl 动漫封面
     * @param {string} bannerUrl 动漫横幅
     * @param {number} status 动漫状态 0-即将上线 1-连载中 2-已完结
     * @param {number} type 动漫类型 0-剧场版 1-日番 2-美番 3-国番 4-里番
     * @param {string} director 动漫导演 [可选]
     * @param {string} cv 动漫声优 [可选]
     * @param {number} year 动漫发行年份
     * @param {number} month 动漫发行月份 0-一月番 1-四月番 2-七月番 3-十月番
     * @param {string} seasonName 动漫所属季名称 [可选]
     * @param {number} season 动漫所属季
     * @param {string[]} tags 动漫分类ID
     */
    static async create({series, name, tags, season, ...rest}) {
        try {
            let data = {animeSeriesId: series, name, season, ...rest};
            // 检查动漫系列是否存在
            const existingSeries = await AnimeSeriesDao.findById(series);
            if (!existingSeries) throw new NotFound('动漫系列不存在');
            // 检查动漫分类是否存在
            if (tags && tags.length) {
                const existingTags = await AnimeTagDao.findByIds(tags);
                if (existingTags.length !== tags.length) {
                    const missingTags = tags
                        .filter(id => !existingTags.some(p => p.id === id))
                        .map(id => {
                            const tag = existingTags.find(p => p.id === id);
                            return tag ? tag.name : id;
                        });
                    throw new NotFound(
                        `动漫分类不存在：${missingTags.join(', ')}`
                    );
                }
                data.animeTags = {
                    connect: tags.map(id => ({id}))
                };
            }
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findBySeriesAndSeason(
                series,
                season
            );
            if (existingAnime) throw new Existing(`动漫已存在`);

            return await AnimeDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫删除
     * @param {string} id 动漫ID
     */
    static async delete({id}) {
        try {
            const existing = await AnimeDao.findById(id);
            if (!existing) throw new NotFound('动漫不存在');

            return await AnimeDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 动漫状态 0-即将上线 1-连载中 2-已完结 [可选]
     * @param {number[]} types - 动漫类型 0-剧场版 1-日番 2-美番 3-国番 4-里番 [可选]
     * @param {number[]} months - 动漫发行月份 0-一月番 1-四月番 2-七月番 3-十月番 [可选]
     * @param {number[]} years - 动漫发行年份 [1970 - 2099] [可选]
     * @param {string[]} tags - 动漫分类ID [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'name',
        status = [],
        types = [],
        months = [],
        years = [],
        tags = [],
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
                    type: types.length ? {in: types} : undefined,
                    month: months.length ? {in: months} : undefined,
                    year: years.length ? {in: years} : undefined,
                    animeTags: tags.length
                        ? {some: {id: {in: tags}}}
                        : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    animeTags: {select: {id: true, name: true}},
                    _count: {select: {animeCollections: true}},
                    animeRatings: {select: {score: true}}
                },
                omit: {updatedAt: true}
            };

            const {rows, total} = await AnimeDao.list(params);

            // 处理每个动漫的评分和收藏数据
            const processedRows = rows.map(anime => {
                const {animeRatings, _count, ...rest} = anime;

                // 计算平均评分
                const totalScore = animeRatings.reduce(
                    (sum, rating) => sum + rating.score,
                    0
                );
                const averageScore =
                    animeRatings.length > 0
                        ? Number((totalScore / animeRatings.length).toFixed(1))
                        : 0;

                return {
                    ...rest,
                    collectionCount: _count.animeCollections,
                    ratingCount: animeRatings.length,
                    averageScore
                };
            });

            return {
                rows: processedRows,
                total
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫编辑
     * @param {string} id 动漫ID
     * @param {string} series 动漫系列ID
     * @param {string} name 动漫名称
     * @param {string} description 动漫简介
     * @param {string} coverUrl 动漫封面
     * @param {string} bannerUrl 动漫横幅
     * @param {number} status 动漫状态 0-即将上线 1-连载中 2-已完结
     * @param {number} type 动漫类型 0-剧场版 1-日番 2-美番 3-国番 4-里番
     * @param {string} director 动漫导演 [可选]
     * @param {string} cv 动漫声优 [可选]
     * @param {number} year 动漫发行年份
     * @param {number} month 动漫发行月份 0-一月番 1-四月番 2-七月番 3-十月番
     * @param {string} seasonName 动漫所属季名称 [可选]
     * @param {number} season 动漫所属季
     * @param {string[]} tags 动漫分类ID
     */
    static async edit({id, series, name, tags, season, ...rest}) {
        try {
            let data = {animeSeriesId: series, name, season, ...rest};
            // 检查动漫是否存在
            const existing = await AnimeDao.findById(id);
            if (!existing) throw new NotFound('动漫不存在');
            // 检查动漫系列是否存在
            const existingSeries = await AnimeSeriesDao.findById(series);
            if (!existingSeries) throw new NotFound('动漫系列不存在');
            // 检查动漫分类是否存在
            if (tags && tags.length) {
                const existingTags = await AnimeTagDao.findByIds(tags);
                if (existingTags.length !== tags.length) {
                    const missingTags = tags
                        .filter(id => !existingTags.some(p => p.id === id))
                        .map(id => {
                            const tag = existingTags.find(p => p.id === id);
                            return tag ? tag.name : id;
                        });
                    throw new NotFound(
                        `动漫分类不存在：${missingTags.join(', ')}`
                    );
                }
                data.animeTags = {
                    connect: tags.map(id => ({id}))
                };
            }
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findByIdAndSeriesAndSeason(
                id,
                series,
                season
            );
            if (existingAnime) throw new Existing(`动漫已存在`);

            return await AnimeDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫选项
     */
    static async options() {
        try {
            const params = {
                select: {id: true, name: true},
                orderBy: {createdAt: 'desc'}
            };

            const result = await AnimeDao.list(params);

            return result.rows.map(item => ({
                label: item.name,
                value: item.id
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeService;
