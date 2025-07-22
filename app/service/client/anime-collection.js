const AnimeCollectionDao = require('@dao/anime-collection');
const AnimeDao = require('@dao/anime');
const {NotFound, Existing} = require('@core/http-exception');

class AnimeCollectionService {
    /**
     * @title 首页我的追番
     * @param {string[]} id 当前用户ID
     */
    static async options({id}) {
        try {
            const params = {
                where: {userId: id},
                page: 1,
                pageSize: 5,
                userId: id
            };
            const {rows, total} = await AnimeCollectionDao.rawOptions(params);

            const data = rows.map(item => {
                const {videoId, latestVideoId, ...rest} = item;
                return {
                    ...rest,
                    videoId: videoId || latestVideoId
                };
            });
            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 追番
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async create({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(animeId);
            if (!anime) throw new NotFound('动漫不存在');

            // 检查我的追番中该动漫是否存在
            const existing = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                animeId
            );
            if (existing) throw new Existing('动漫已追番');

            const data = {userId, animeId};

            return await AnimeCollectionDao.create(data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 取消追番
     * @param {string} userId 当前用户ID
     * @param {string} animeId 动漫ID
     */
    static async delete({userId, animeId}) {
        try {
            // 检查动漫是否存在
            const anime = await AnimeDao.findById(animeId);
            if (!anime) throw new NotFound('动漫不存在');

            // 检查我的追番中该动漫是否存在
            const existing = await AnimeCollectionDao.findByUserAndAnime(
                userId,
                animeId
            );

            if (!existing) throw new NotFound('动漫未追番');

            return await AnimeCollectionDao.deleteByUserAndAnime(
                userId,
                animeId
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeCollectionService;
