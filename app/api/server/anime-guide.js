const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeGuideService = require('@service/anime-guide');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeGuideCreateValidator,
    AnimeGuideListValidator,
    AnimeGuideEditValidator,
    AnimeGuideDeleteValidator
} = require('@validators/server/anime-guide');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime-guides';

// 新番导视创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeGuideCreateValidator(ctx.request.body);
    await AnimeGuideService.create(params);
    ctx.status = 201;
    ctx.body = res.success('新番导视创建成功');
});

//新番导视删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeGuideDeleteValidator(ctx.params);
        await AnimeGuideService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('新番导视删除成功');
    }
);

// 新番导视列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeGuideListValidator(ctx.request.query);
    const list = await AnimeGuideService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '新番导视列表获取成功');
});

// 新番导视编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = AnimeGuideEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await AnimeGuideService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '新番导视编辑成功');
    }
);

module.exports = router;
