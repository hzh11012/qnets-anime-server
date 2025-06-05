const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeRatingService = require('@service/server/anime-rating');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeRatingListValidator,
    AnimeRatingEditValidator,
    AnimeRatingDeleteValidator
} = require('@validators/server/anime-rating');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'anime-ratings';

// 动漫评分删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeRatingDeleteValidator(ctx.params);
        await AnimeRatingService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫评分删除成功');
    }
);

// 动漫评分列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = AnimeRatingListValidator(ctx.request.query);
        const list = await AnimeRatingService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '动漫评分列表获取成功');
    }
);

// 动漫评分编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = AnimeRatingEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await AnimeRatingService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '动漫评分编辑成功');
    }
);

module.exports = router;
