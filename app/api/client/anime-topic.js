const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTopicService = require('@app/service/client/anime-topic');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeTopicListValidator,
    AnimeTopicDetailValidator,
    AnimeTopicDetailListValidator
} = require('@validators/client/anime-topic');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-topics';

// 动漫专题 (用于首页)
router.get(
    `/${PATH}/options`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const permissions = ctx.auth.permissions;
        const options = await AnimeTopicService.options({permissions});
        ctx.status = 200;
        ctx.body = res.json(options, '动漫专题获取成功');
    }
);

// 动漫专题列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const permissions = ctx.auth.permissions;
        const params = AnimeTopicListValidator(ctx.request.query);
        const data = await AnimeTopicService.list({
            permissions,
            ...params
        });
        ctx.status = 200;
        ctx.body = res.json(data, '动漫专题获取成功');
    }
);

// 动漫专题详情
router.get(
    `/${PATH}/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = AnimeTopicDetailValidator(ctx.params);
        const data = await AnimeTopicService.detail(params);
        ctx.status = 200;
        ctx.body = res.json(data, '动漫专题详情获取成功');
    }
);

// 动漫专题内容列表
router.get(
    `/${PATH}/:id/animes`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const permissions = ctx.auth.permissions;
        const params = AnimeTopicDetailListValidator(
            Object.assign(ctx.params, ctx.request.query)
        );
        const data = await AnimeTopicService.animes({
            userId,
            permissions,
            ...params
        });
        ctx.status = 200;
        ctx.body = res.json(data, '动漫专题内容列表获取成功');
    }
);

module.exports = router;
