const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeCollectionService = require('@service/server/anime-collection');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeCollectionListValidator,
    AnimeCollectionDeleteValidator
} = require('@validators/server/anime-collection');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'anime-collections';

// 动漫收藏删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = AnimeCollectionDeleteValidator(ctx.params);
        await AnimeCollectionService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('动漫收藏删除成功');
    }
);

// 动漫收藏列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = AnimeCollectionListValidator(ctx.request.query);
        const list = await AnimeCollectionService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '动漫收藏列表获取成功');
    }
);

module.exports = router;
