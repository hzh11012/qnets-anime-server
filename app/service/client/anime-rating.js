const AnimeRatingDao = require('@dao/anime-rating');
const {Existing} = require('@core/http-exception');

class AnimeRatingService {
    /**
     * @title 动漫评分
     * @param {string} userId 当前用户ID
     * @param {string} id 动漫ID
     * @param {number} score 评分分数
     * @param {string} content 评分内容
     */
    static async create({userId, id, score, content}) {
        try {
            const existing = await AnimeRatingDao.findByUserAndAnime(
                userId,
                id
            );
            if (existing) throw new Existing('已评分');

            const data = {userId, animeId: id, score, content};
            return await AnimeRatingDao.create(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeRatingService;
