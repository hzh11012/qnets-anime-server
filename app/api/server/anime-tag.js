const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTagService = require('@service/anime-tag');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeTagCreateValidator,
    AnimeTagListValidator,
    AnimeTagDeleteValidator
} = require('@validators/anime-tag');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'anime-tags';

// 动漫分类创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = AnimeTagCreateValidator(ctx.request.body);
    await AnimeTagService.create(params);
    ctx.status = 201;
    ctx.body = res.success('动漫分类创建成功');
});

// 动漫分类删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeTagDeleteValidator(ctx.params);
        await AnimeTagService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫分类删除成功');
    }
);

// 动漫系列列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = AnimeTagListValidator(ctx.request.query);
    const list = await AnimeTagService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '动漫分类列表获取成功');
});

module.exports = router;
