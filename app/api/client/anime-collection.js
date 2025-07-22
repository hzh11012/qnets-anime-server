const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AnimeCollectionService = require('@service/client/anime-collection');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    AnimeCollectionCreateValidator,
    AnimeCollectionDeleteValidator
} = require('@validators/client/anime-collection');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'anime-collections';

// 我的追番 (用于首页)
router.get(
    `/${PATH}/options`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const options = await AnimeCollectionService.options({id: userId});
        ctx.status = 200;
        ctx.body = res.json(options, '动漫追番获取成功');
    }
);

// 追番
router.post(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeCollectionCreateValidator(ctx.request.body);
        await AnimeCollectionService.create({userId, animeId: params.id});
        ctx.status = 201;
        ctx.body = res.success('追番成功');
    }
);

// 取消追番
router.delete(
    `/${PATH}/:animeId`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = AnimeCollectionDeleteValidator(ctx.params);
        await AnimeCollectionService.delete({userId, animeId: params.animeId});
        ctx.status = 200;
        ctx.body = res.success('取消追番成功');
    }
);

module.exports = router;
