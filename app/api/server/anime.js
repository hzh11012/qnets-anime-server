const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeService = require('@service/anime');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeCreateValidator,
    AnimeListValidator,
    AnimeEditValidator,
    AnimeDeleteValidator
} = require('@validators/server/anime');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime';

// 动漫创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeCreateValidator(ctx.request.body);
    await AnimeService.create(params);
    ctx.status = 201;
    ctx.body = res.success('动漫创建成功');
});

// 动漫删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeDeleteValidator(ctx.params);
        await AnimeService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫删除成功');
    }
);

// 动漫列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeListValidator(ctx.request.query);
    const list = await AnimeService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '动漫列表获取成功');
});

// 动漫编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = AnimeEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const user = await AnimeService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(user, '动漫编辑成功');
    }
);

// 动漫选项
router.get(`/${PATH}/options`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const options = await AnimeService.options();
    ctx.status = 200;
    ctx.body = res.json(options, '动漫选项获取成功');
});

module.exports = router;
