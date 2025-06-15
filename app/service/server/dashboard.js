const DashboardDao = require('@dao/dashboard');
const redis = require('@core/redis');

// 缓存键常量
const CACHE_KEYS = {
    USERS: 'dashboard:users',
    ANIMES: 'dashboard:animes',
    COMMENTS: 'dashboard:comments',
    MESSAGES: 'dashboard:messages',
    RATINGS: 'dashboard:ratings',
    COLLECTIONS: 'dashboard:collections',
    PLAYS: 'dashboard:plays',
    DANMAKUS: 'dashboard:danmakus'
};

// 缓存过期时间（1小时）
const CACHE_TTL = 1 * 60 * 60;

class DashboardService {
    /**
     * 生成日期范围
     * @param {number} day - 天数
     * @returns {{startDate: Date, endDate: Date}} 日期范围
     */
    static generateDateRange(day) {
        const endDate = new Date();
        endDate.setUTCHours(23, 59, 59, 999);

        const startDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        startDate.setDate(startDate.getDate() - day + 1);
        startDate.setUTCHours(0, 0, 0, 0);

        return {startDate, endDate};
    }

    /**
     * 生成日期数组
     * @param {Date} startDate - 开始日期
     * @param {number} day - 天数
     * @returns {string[]} 日期数组
     */
    static generateDateArray(startDate, day) {
        return Array.from({length: day}, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
        });
    }

    /**
     * 处理统计数据
     * @param {Array} rows - 原始数据
     * @param {string[]} dateArray - 日期数组
     * @param {Set} keys - 返回字段
     * @returns {Array} 处理后的数据
     */
    static processStatistics(rows, dateArray, keys) {
        const countMap = new Map(
            rows.map(row => {
                const date = new Date(row.date).toISOString().split('T')[0];
                const data = {date};
                // 处理除了 date 以外的所有字段
                Object.keys(row).forEach(key => {
                    if (key !== 'date') {
                        data[key] = Number(row[key]) || 0;
                    }
                });
                return [date, data];
            })
        );

        return dateArray.map(date => {
            const result = {date};
            keys.forEach(key => {
                result[key] = countMap.get(date)?.[key] || 0;
            });
            return result;
        });
    }

    /**
     * 获取图标统计数据
     * @param {string} cacheKey - 缓存键
     * @param {number} day - 天数
     * @param {Function} daoMethod - DAO方法
     * @param {Set} keys - 统计字段
     */
    static async getChartStatistics(cacheKey, day, daoMethod, keys) {
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) return JSON.parse(cachedData);

            const {startDate, endDate} = this.generateDateRange(day);
            const params = {
                where: {createdAt: {gte: startDate}},
                startDate,
                endDate
            };

            const {total, rows} = await daoMethod(params);
            const dateArray = this.generateDateArray(startDate, day);
            const processedRows = this.processStatistics(rows, dateArray, keys);

            const result = {total, rows: processedRows};
            await redis.set(cacheKey, JSON.stringify(result), CACHE_TTL);

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @title 用户统计信息
     * @param {number} day - 最近X天数据
     */
    static async user(day = 7) {
        const keys = new Set(['count']);
        return this.getChartStatistics(
            CACHE_KEYS.USERS,
            day,
            DashboardDao.user,
            keys
        );
    }

    /**
     * @title 动漫统计信息
     * @param {number} day - 最近X天数据
     */
    static async anime(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.ANIMES,
            day,
            DashboardDao.anime,
            keys
        );
    }

    /**
     * @title 评论统计信息
     * @param {number} day - 最近X天数据
     */
    static async comment(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.COMMENTS,
            day,
            DashboardDao.comment,
            keys
        );
    }

    /**
     * @title 留言统计信息
     * @param {number} day - 最近X天数据
     */
    static async message(day = 7) {
        const keys = new Set(['0', '1', '2', '3']);
        return this.getChartStatistics(
            CACHE_KEYS.MESSAGES,
            day,
            DashboardDao.message,
            keys
        );
    }

    /**
     * @title 评分统计信息
     * @param {number} day - 最近X天数据
     */
    static async rating(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.RATINGS,
            day,
            DashboardDao.rating,
            keys
        );
    }

    /**
     * @title 收藏统计信息
     * @param {number} day - 最近X天数据
     */
    static async collection(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.COLLECTIONS,
            day,
            DashboardDao.collection,
            keys
        );
    }

    /**
     * @title 播放量统计信息
     * @param {number} day - 最近X天数据
     */
    static async play(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.PLAYS,
            day,
            DashboardDao.play,
            keys
        );
    }

    /**
     * @title 弹幕统计信息
     * @param {number} day - 最近X天数据
     */
    static async danmaku(day = 7) {
        const keys = new Set(['0', '1', '2', '3', '4']);
        return this.getChartStatistics(
            CACHE_KEYS.DANMAKUS,
            day,
            DashboardDao.danmaku,
            keys
        );
    }
}

module.exports = DashboardService;
