const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeSeriesService = require('@service/client/anime-series');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {AnimeSeriesOptionValidator} = require('@validators/client/anime-series');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-series';

// 动漫系列
router.get(
    `/${PATH}/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeSeriesOptionValidator(ctx.params);
        const list = await AnimeSeriesService.list({userId, ...params});
        ctx.status = 200;
        ctx.body = res.json(list, '动漫系列获取成功');
    }
);

module.exports = router;
