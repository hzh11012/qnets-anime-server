const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeService = require('@service/client/anime');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {AnimeOptionValidator} = require('@validators/client/anime');
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
        const params = AnimeOptionValidator(ctx.request.query);
        const options = await AnimeService.options({permissions, ...params});
        ctx.status = 200;
        ctx.body = res.json(options, '动漫获取成功');
    }
);

module.exports = router;
