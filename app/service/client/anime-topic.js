const AnimeTopicDao = require('@dao/anime-topic');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');

class AnimeTopicService {
    /**
     * @title 首页专题
     * @param {string[]} permissions 当前用户权限
     */
    static async options({permissions}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            const params = {
                take: 5,
                orderBy: {updatedAt: 'desc'},
                select: {
                    id: true,
                    name: true,
                    coverUrl: true,
                    _count: {
                        select: {
                            animes: {
                                where: isAllowAnimeType4 ? {} : {type: {not: 4}}
                            }
                        }
                    }
                }
            };

            const {rows, total} = await AnimeTopicDao.list(params);

            const data = rows.map(({_count, ...rest}) => ({
                ...rest,
                count: _count.animes
            }));

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeTopicService;
