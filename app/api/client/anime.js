const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeService = require('@service/client/anime');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeOptionValidator,
    AnimeGuessLikeListValidator,
    AnimeDetailValidator,
    AnimeRecommendValidator
} = require('@validators/client/anime');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'animes';

// 动漫获取 (用于首页)
router.get(
    `/${PATH}/options`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const permissions = ctx.auth.permissions;
        const userId = ctx.auth.userId;
        const params = AnimeOptionValidator(ctx.request.query);
        const options = await AnimeService.options({
            permissions,
            userId,
            ...params
        });
        ctx.status = 200;
        ctx.body = res.json(options, '动漫获取成功');
    }
);

// 猜你喜欢（协同过滤，综合评分/追番/历史）
router.get(
    `/${PATH}/guess-you-like`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeGuessLikeListValidator(ctx.request.query);
        const list = await AnimeService.guessYouLike({userId, ...params});
        ctx.status = 200;
        ctx.body = res.json(list, '猜你喜欢获取成功');
    }
);

// 动漫推荐
router.get(
    `/${PATH}/recommend/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeRecommendValidator(ctx.params);
        const list = await AnimeService.recommend({userId, animeId: params.id});
        ctx.status = 200;
        ctx.body = res.json(list, '动漫推荐获取成功');
    }
);

// 动漫详情
router.get(
    `/${PATH}/:videoId`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeDetailValidator(ctx.params);
        const data = await AnimeService.detail({userId, ...params});
        ctx.status = 200;
        ctx.body = res.json(data, '动漫详情获取成功');
    }
);

module.exports = router;
