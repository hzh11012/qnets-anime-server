const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeSeriesService = require('@service/anime-series');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeSeriesCreateValidator,
    AnimeSeriesListValidator,
    AnimeSeriesDeleteValidator
} = require('@validators/anime-series');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime-series';

// 动漫系列创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeSeriesCreateValidator(ctx.request.body);
    await AnimeSeriesService.create(params);
    ctx.status = 201;
    ctx.body = res.success('动漫系列创建成功');
});

// 动漫系列删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeSeriesDeleteValidator(ctx.params);
        await AnimeSeriesService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫系列删除成功');
    }
);

// 动漫系列列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeSeriesListValidator(ctx.request.query);
    const list = await AnimeSeriesService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '动漫系列列表获取成功');
});

module.exports = router;
