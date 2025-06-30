const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTopicService = require('@app/service/client/anime-topic');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
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

module.exports = router;
