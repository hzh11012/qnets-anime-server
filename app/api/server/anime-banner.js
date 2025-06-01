const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeBannerService = require('@service/anime-banner');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeBannerCreateValidator,
    AnimeBannerListValidator,
    AnimeBannerDeleteValidator
} = require('@validators/server/anime-banner');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime-banners';

// 动漫轮播创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeBannerCreateValidator(ctx.request.body);
    await AnimeBannerService.create(params);
    ctx.status = 201;
    ctx.body = res.success('动漫轮播创建成功');
});

//动漫轮播删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeBannerDeleteValidator(ctx.params);
        await AnimeBannerService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫轮播删除成功');
    }
);

// 动漫轮播列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeBannerListValidator(ctx.request.query);
    const list = await AnimeBannerService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '动漫轮播列表获取成功');
});

module.exports = router;
