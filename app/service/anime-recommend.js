const AnimeRecommendDao = require('@dao/anime-recommend');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeRecommendService {
    /**
     * @title 动漫推荐创建
     * @param {string} name 动漫推荐标题
     * @param {number} status 动漫推荐状态 0-禁用 1-启用
     * @param {string[]} animes 动漫ID
     */
    static async create({name, status, animes}) {
        try {
            let data = {name, status};
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
            // 检查动漫推荐是否存在
            const existingAnimeRecommend =
                await AnimeRecommendDao.findByName(name);
            if (existingAnimeRecommend) throw new Existing(`动漫推荐已存在`);

            return await AnimeRecommendDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫推荐删除
     * @param {string} id 动漫ID
     */
    static async delete({id}) {
        try {
            const existing = await AnimeRecommendDao.findById(id);
            if (!existing) throw new NotFound('动漫推荐不存在');

            return await AnimeRecommendDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫推荐列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} status - 动漫推荐状态 0-禁用 1-启用
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

            return await AnimeRecommendDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫推荐编辑
     * @param {string} id 动漫推荐ID
     * @param {string} name 动漫推荐标题
     * @param {number} status 动漫推荐状态 0-禁用 1-启用
     * @param {string[]} animes 动漫ID
     */
    static async edit({id, name, status, animes}) {
        try {
            let data = {name, status};
            // 检查动漫推荐是否存在
            const existing = await AnimeRecommendDao.findById(id);
            if (!existing) throw new NotFound('动漫推荐不存在');

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

            // 检查动漫是否存在
            const existingAnimeRecommend =
                await AnimeRecommendDao.findByName(name);
            if (existingAnimeRecommend) throw new Existing(`动漫推荐已存在`);

            return await AnimeRecommendDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeRecommendService;
