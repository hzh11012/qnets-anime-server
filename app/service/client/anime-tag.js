const AnimeTagDao = require('@dao/anime-tag');

class AnimeTagService {
    /**
     * @title 动漫分类选项
     */
    static async options() {
        try {
            const params = {
                select: {name: true},
                orderBy: {createdAt: 'desc'}
            };

            const result = await AnimeTagDao.list(params);

            return result.rows.map(item => {
                return {label: item.name, value: item.name};
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeTagService;
