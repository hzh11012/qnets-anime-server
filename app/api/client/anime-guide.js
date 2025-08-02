const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeGuideService = require('@service/client/anime-guide');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {AnimeGuideListValidator} = require('@validators/client/anime-guide');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-guides';

// 新番导视
router.get(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const permissions = ctx.auth.permissions;
        const params = AnimeGuideListValidator(ctx.request.query);
        const list = await AnimeGuideService.list({
            permissions,
            userId,
            ...params
        });
        ctx.status = 200;
        ctx.body = res.json(list, '新番导视获取成功');
    }
);

module.exports = router;
