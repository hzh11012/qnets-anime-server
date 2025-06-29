const AnimeDao = require('@dao/anime');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');
const {Forbidden} = require('@core/http-exception');

class AnimeService {
    /**
     * @title 首页动漫获取 (用于首页)
     * @param {string[]} permissions 当前用户权限
     * @param {number} type 动漫类型 0-剧场版 1-日番 2-美番 3-国番 4-里番
     */
    static async options({permissions, type}) {
        try {
            // 是否允许查询里番
            const isAllowAnimeType4 = [
                ADMIN,
                ANIEM_TYPE_4_PERMISSION.permission
            ].some(p => permissions.includes(p));

            if (type === 4 && !isAllowAnimeType4)
                throw new Forbidden('权限不足');

            const params = {
                take: 7,
                orderBy: [{year: 'desc'}, {month: 'desc'}, {updatedAt: 'desc'}],
                where: {type},
                select: {
                    id: true,
                    name: true,
                    remark: true,
                    coverUrl: true,
                    status: true,
                    _count: {select: {videos: true}}
                }
            };

            const {rows, total} = await AnimeDao.list(params);

            const data = rows.map(({_count, ...rest}) => ({
                ...rest,
                videoCount: _count.videos
            }));

            return {total, rows: data};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AnimeService;
