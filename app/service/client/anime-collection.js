const AnimeCollectionDao = require('@dao/anime-collection');

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

            return {total, rows};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeCollectionService;
