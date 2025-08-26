const AnimeBannerDao = require('@dao/anime-banner');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeBannerService {
    /**
     * @title 动漫轮播创建
     * @param {string} animeId 动漫ID
     */
    static async create({animeId}) {
        try {
            // 检查动漫系列是否存在
            const existingAnime = await AnimeDao.findById(animeId);
            if (!existingAnime) throw new NotFound('动漫不存在');
            // 检查动漫轮播中该动漫是否存在
            const existing = await AnimeBannerDao.findByAnimeId(animeId);
            if (existing) throw new Existing('动漫轮播已存在');

            const data = {animeId};

            return await AnimeBannerDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫轮播删除
     * @param {string} id 轮播ID
     */
    static async delete({id}) {
        try {
            // 检查动漫轮播是否存在
            const existing = await AnimeBannerDao.findById(id);
            if (!existing) throw new NotFound('动漫轮播不存在');

            return await AnimeBannerDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 动漫轮播列表
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
                where: {
                    anime: {[type]: keyword ? {contains: keyword} : undefined}
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    anime: {
                        select: {
                            name: true,
                            seasonName: true,
                            description: true,
                            bannerUrl: true
                        }
                    }
                },
                omit: {updatedAt: true}
            };

            return await AnimeBannerDao.list(params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeBannerService;
