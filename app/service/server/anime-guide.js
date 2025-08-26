const AnimeDao = require('@dao/anime');
const AnimeGuideDao = require('@dao/anime-guide');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeGuideService {
    /**
     * @title 新番导视创建
     * @param {string} animeId 动漫ID
     * @param {number} updateDay 动漫更新日 0-6 分别对应周一到周日
     * @param {string} updateTime 动漫更新时间
     */
    static async create({animeId, updateDay, updateTime}) {
        try {
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findById(animeId);
            if (!existingAnime) throw new NotFound('动漫不存在');
            // 检查新番导视中该动漫是否存在
            const existing = await AnimeGuideDao.findByAnimeId(animeId);
            if (existing) throw new Existing('新番导视已存在');

            const data = {animeId, updateDay, updateTime};

            return await AnimeGuideDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 新番导视删除
     * @param {string} id 新番导视ID
     */
    static async delete({id}) {
        try {
            // 检查新番导视是否存在
            const existing = await AnimeGuideDao.findById(id);
            if (!existing) throw new NotFound('新番导视不存在');

            return await AnimeGuideDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 新番导视列表
     * @param {number} page - 页码 [可选]
     * @param {number} pageSize - 每页数量 [可选]
     * @param {string} keyword - 搜索关键词 [可选]
     * @param {string} type - 搜索类型 [可选]
     * @param {number[]} updateDays - 更新日期 0-6 分别对应周日到周六 [可选]
     * @param {number[]} status - 动漫状态 0-即将上线 1-连载中 2-已完结 [可选]
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
        tags = [],
        updateDays = [],
        order = 'DESC',
        orderBy = 'createdAt'
    }) {
        try {
            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    anime: {
                        [type]: keyword ? {contains: keyword} : undefined,
                        status: status.length ? {in: status} : undefined,
                        animeTags: tags.length
                            ? {some: {id: {in: tags}}}
                            : undefined
                    },
                    updateDay: updateDays.length ? {in: updateDays} : undefined
                },
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    anime: {
                        select: {
                            name: true,
                            seasonName: true,
                            coverUrl: true,
                            status: true,
                            animeTags: {select: {id: true, name: true}}
                        }
                    }
                },
                omit: {updatedAt: true}
            };

            return await AnimeGuideDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 新番导视编辑
     * @param {string} id 新番导视ID
     * @param {string} animeId 动漫ID
     * @param {number} updateDay 更新日期 0-6 分别对应周日到周六
     * @param {string} updateTime 更新时间
     */
    static async edit({id, animeId, updateDay, updateTime}) {
        try {
            let data = {animeId, updateDay, updateTime};
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findById(animeId);
            if (!existingAnime) throw new NotFound('动漫不存在');
            // 检查新番导视是否存在
            const existing = await AnimeGuideDao.findById(id);
            if (!existing) throw new NotFound('新番导视不存在');

            // 检查新番导视中该动漫是否重复
            if (existing.animeId !== animeId) {
                const existingAnime =
                    await AnimeGuideDao.findByAnimeId(animeId);
                if (existingAnime) throw new Existing('动漫已存在');
            }

            return await AnimeGuideDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeGuideService;
