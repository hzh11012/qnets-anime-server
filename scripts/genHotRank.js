/**
 * @title 热门榜单定时任务
 * @description 每小时更新一次热门排行榜
 */

const cron = require('node-cron');
const AnimeService = require('@service/client/anime');
const {ANIEM_TYPE_4_PERMISSION, ADMIN} = require('@core/consts');

cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] 开始刷新热门动漫榜单缓存...`);

    // 刷新有 type=4 权限的榜单
    await AnimeService.hotRank({
        permissions: [ADMIN, ANIEM_TYPE_4_PERMISSION.permission]
    });

    // 刷新无 type=4 权限的榜单
    await AnimeService.hotRank({permissions: []});

    console.log(`[${new Date().toISOString()}] 热门动漫榜单缓存刷新完成`);
});
