const AnimeTopicDao = require('@app/dao/anime-topic');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeTopicService {
    /**
     * @title 动漫专题创建
     * @param {string} name 动漫专题标题
     * @param {string} description 动漫专题简介
     * @param {string} coverUrl 动漫荐封面
     * @param {number} status 动漫专题状态 0-禁用 1-启用
     * @param {string[]} animes 动漫ID
     */
    static async create({name, animes, ...rest}) {
        try {
            let data = {name, ...rest};
            // 检查动漫是否存在
            if (animes && animes.length) {
                const existingAnimes = await AnimeDao.findByIds(animes);
                if (existingAnimes.length !== animes.length) {
                    const missingAnimes = animes
                        .filter(id => !existingAnimes.some(p => p.id === id))
                        .map(id => {
                            const anime = existingAnimes.find(p => p.id === id);
                            return anime ? anime.name : id;
                        });
                    throw new NotFound(
                        `动漫不存在：${missingAnimes.join(', ')}`
                    );
                }
                data.animes = {
                    connect: animes.map(id => ({id}))
                };
            }
            // 检查动漫专题是否存在
            const existingAnimeTopic = await AnimeTopicDao.findByName(name);
            if (existingAnimeTopic) throw new Existing(`动漫专题已存在`);

            return await AnimeTopicDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫专题删除
     * @param {string} id 动漫ID
     */
    static async delete({id}) {
        try {
            const existing = await AnimeTopicDao.findById(id);
            if (!existing) throw new NotFound('动漫专题不存在');

            return await AnimeTopicDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫专题列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 动漫专题状态 0-禁用 1-启用  [可选]
     * @param {string} order - 排序 [可选]
     * @param {string} orderBy - 排序字段 [可选]
     */
    static async list({
        page = 1,
        pageSize = 10,
        keyword,
        type = 'name',
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
                include: {animes: {select: {id: true, name: true}}},
                omit: {updatedAt: true}
            };

            return await AnimeTopicDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫专题编辑
     * @param {string} id 动漫专题ID
     * @param {string} name 动漫专题标题
     * @param {string} description 动漫专题简介
     * @param {string} coverUrl 动漫荐封面
     * @param {number} status 动漫专题状态 0-禁用 1-启用
     * @param {string[]} animes 动漫ID
     */
    static async edit({id, name, animes, ...rest}) {
        try {
            let data = {name, ...rest};
            // 检查动漫专题是否存在
            const existing = await AnimeTopicDao.findById(id);
            if (!existing) throw new NotFound('动漫专题不存在');

            // 检查动漫是否存在
            if (animes && animes.length) {
                const existingAnimes = await AnimeDao.findByIds(animes);
                if (existingAnimes.length !== animes.length) {
                    const missingAnimes = animes
                        .filter(id => !existingAnimes.some(p => p.id === id))
                        .map(id => {
                            const anime = existingAnimes.find(p => p.id === id);
                            return anime ? anime.name : id;
                        });
                    throw new NotFound(
                        `动漫不存在：${missingAnimes.join(', ')}`
                    );
                }
                data.animes = {
                    set: animes.map(id => ({id}))
                };
            }

            // 检查动漫是否存在
            if (existing.name !== name) {
                const existingAnimeTopic = await AnimeTopicDao.findByName(name);
                if (existingAnimeTopic) throw new Existing(`动漫专题已存在`);
            }

            return await AnimeTopicDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeTopicService;
