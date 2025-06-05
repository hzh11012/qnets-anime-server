const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTagService = require('@service/server/anime-tag');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeTagCreateValidator,
    AnimeTagListValidator,
    AnimeTagDeleteValidator
} = require('@validators/server/anime-tag');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'anime-tags';

// 动漫分类创建
router.post(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const params = AnimeTagCreateValidator(ctx.request.body);
        await AnimeTagService.create(params);
        ctx.status = 201;
        ctx.body = res.success('动漫分类创建成功');
    }
);

// 动漫分类删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeTagDeleteValidator(ctx.params);
        await AnimeTagService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫分类删除成功');
    }
);

// 动漫分类列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = AnimeTagListValidator(ctx.request.query);
        const list = await AnimeTagService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '动漫分类列表获取成功');
    }
);

// 动漫分类选项
router.get(
    `/${PATH}/options`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const options = await AnimeTagService.options();
        ctx.status = 200;
        ctx.body = res.json(options, '动漫分类选项获取成功');
    }
);

module.exports = router;
