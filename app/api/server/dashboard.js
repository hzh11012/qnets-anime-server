const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const DashboardService = require('@service/server/dashboard');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX} = require('@core/consts');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'dashboard';

// 用户相关
router.get(`/${PATH}/users`, auth(), async ctx => {
    const list = await DashboardService.user();
    ctx.status = 200;
    ctx.body = res.json(list, '用户统计数据获取成功');
});

// 动漫相关
router.get(`/${PATH}/animes`, auth(), async ctx => {
    const list = await DashboardService.anime();
    ctx.status = 200;
    ctx.body = res.json(list, '动漫统计数据获取成功');
});

// 评论相关
router.get(`/${PATH}/comments`, auth(), async ctx => {
    const list = await DashboardService.comment();
    ctx.status = 200;
    ctx.body = res.json(list, '评论统计数据获取成功');
});

// 留言相关
router.get(`/${PATH}/messages`, auth(), async ctx => {
    const list = await DashboardService.message();
    ctx.status = 200;
    ctx.body = res.json(list, '留言统计数据获取成功');
});

// 收藏相关
router.get(`/${PATH}/collections`, auth(), async ctx => {
    const list = await DashboardService.collection();
    ctx.status = 200;
    ctx.body = res.json(list, '收藏统计数据获取成功');
});

// 评分相关
router.get(`/${PATH}/ratings`, auth(), async ctx => {
    const list = await DashboardService.rating();
    ctx.status = 200;
    ctx.body = res.json(list, '评分统计数据获取成功');
});

// 弹幕相关
router.get(`/${PATH}/danmakus`, auth(), async ctx => {
    const list = await DashboardService.danmaku();
    ctx.status = 200;
    ctx.body = res.json(list, '弹幕统计数据获取成功');
});

// 播放量相关
router.get(`/${PATH}/plays`, auth(), async ctx => {
    const list = await DashboardService.play();
    ctx.status = 200;
    ctx.body = res.json(list, '播放量统计数据获取成功');
});

module.exports = router;
