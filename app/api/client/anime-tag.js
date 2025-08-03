const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeTagService = require('@service/client/anime-tag');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX} = require('@core/consts');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-tags';

// 动漫分类选项
router.get(`/${PATH}/options`, auth(), async ctx => {
    const options = await AnimeTagService.options();
    ctx.status = 200;
    ctx.body = res.json(options, '动漫分类选项获取成功');
});

module.exports = router;
