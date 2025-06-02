const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeRecommendService = require('@service/anime-recommend');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeRecommendCreateValidator,
    AnimeRecommendListValidator,
    AnimeRecommendEditValidator,
    AnimeRecommendDeleteValidator
} = require('@validators/server/anime-recommend');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime-recommends';

// 动漫推荐创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeRecommendCreateValidator(ctx.request.body);
    await AnimeRecommendService.create(params);
    ctx.status = 201;
    ctx.body = res.success('动漫推荐创建成功');
});

// 动漫推荐删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeRecommendDeleteValidator(ctx.params);
        await AnimeRecommendService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫推荐删除成功');
    }
);

// 动漫推荐列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeRecommendListValidator(ctx.request.query);
    const list = await AnimeRecommendService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '动漫推荐列表获取成功');
});

// 动漫推荐编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = AnimeRecommendEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await AnimeRecommendService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '动漫推荐编辑成功');
    }
);

module.exports = router;
