const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTopicService = require('@service/server/anime-topic');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeTopicCreateValidator,
    AnimeTopicListValidator,
    AnimeTopicEditValidator,
    AnimeTopicDeleteValidator
} = require('@validators/server/anime-topic');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'anime-topics';

// 动漫专题创建
router.post(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const params = AnimeTopicCreateValidator(ctx.request.body);
        await AnimeTopicService.create(params);
        ctx.status = 201;
        ctx.body = res.success('动漫专题创建成功');
    }
);

// 动漫专题删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeTopicDeleteValidator(ctx.params);
        await AnimeTopicService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫专题删除成功');
    }
);

// 动漫专题列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = AnimeTopicListValidator(ctx.request.query);
        const list = await AnimeTopicService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '动漫专题列表获取成功');
    }
);

// 动漫专题编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = AnimeTopicEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await AnimeTopicService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '动漫专题编辑成功');
    }
);

module.exports = router;
