const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeRatingService = require('@service/client/anime-rating');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {AnimeRatingCreateValidator} = require('@validators/client/anime-rating');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-ratings';

// 动漫评分
router.post(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeRatingCreateValidator(ctx.request.body);
        await AnimeRatingService.create({userId, ...params});
        ctx.status = 201;
        ctx.body = res.json('动漫评分成功');
    }
);

module.exports = router;
