const VideoDao = require('@dao/video');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class VideoService {
    /**
     * @title 视频创建
     * @param {string} animeId 动漫ID
     * @param {string} title 视频标题
     * @param {number} episode 集数编号
     * @param {string} url 视频链接
     */
    static async create({animeId, title, episode, url}) {
        try {
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findById(animeId);
            if (!existingAnime) throw new NotFound('动漫不存在');
            // 检查该动漫集数编号是否存在
            const existing = await VideoDao.findByAnimeIdAndEpisode(
                animeId,
                episode
            );
            if (existing) throw new Existing('视频集数已存在');

            const data = {animeId, title, episode, url};

            return await VideoDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 视频删除
     * @param {string} id 视频ID
     */
    static async delete({id}) {
        try {
            // 检查视频是否存在
            const existing = await VideoDao.findById(id);
            if (!existing) throw new NotFound('视频不存在');

            return await VideoDao.delete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 视频列表
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
            const where =
                type === 'name'
                    ? {
                          anime: {
                              name: keyword ? {contains: keyword} : undefined
                          }
                      }
                    : {
                          [type]: keyword ? {contains: keyword} : undefined
                      };

            const params = {
                skip: (page - 1) * pageSize,
                take: pageSize,
                where,
                orderBy: {[orderBy]: order.toLocaleLowerCase()},
                include: {
                    anime: {
                        select: {name: true, seasonName: true, coverUrl: true}
                    }
                },
                omit: {updatedAt: true}
            };

            return await VideoDao.list(params);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 视频编辑
     * @param {string} id 视频ID
     * @param {string} animeId 动漫ID
     * @param {string} title 视频标题
     * @param {number} episode 集数编号
     * @param {string} url 视频链接
     */
    static async edit({id, animeId, title, episode, url}) {
        try {
            // 检查动漫是否存在
            const existingAnime = await AnimeDao.findById(animeId);
            if (!existingAnime) throw new NotFound('动漫不存在');
            // 检查视频是否存在
            const existing = await VideoDao.findById(id);
            if (!existing) throw new NotFound('视频不存在');

            // 检查该动漫集数编号是否重复
            if (existing.episode !== episode) {
                const existingVideo = await VideoDao.findByAnimeIdAndEpisode(
                    animeId,
                    episode
                );
                if (existingVideo) throw new Existing('视频集数已存在');
            }
            const data = {animeId, title, episode, url};

            return await VideoDao.update(id, data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VideoService;
