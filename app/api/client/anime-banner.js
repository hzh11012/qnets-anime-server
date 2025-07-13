const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeBannerService = require('@service/client/anime-banner');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-banners';

// 动漫轮播 (用于首页)
router.get(
    `/${PATH}/options`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const permissions = ctx.auth.permissions;
        const userId = ctx.auth.userId;
        const options = await AnimeBannerService.options({permissions, userId});
        ctx.status = 200;
        ctx.body = res.json(options, '轮播获取成功');
    }
);

module.exports = router;
