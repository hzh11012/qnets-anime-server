const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoHistoryService = require('@service/client/video-history');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    VideoHistoryCreatValidator,
    VideoHistoryListValidator
} = require('@validators/client/video-history');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'video-histories';

// 保存历史记录
router.post(
    `/${PATH}/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = VideoHistoryCreatValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        await VideoHistoryService.create({userId, ...params});
        ctx.status = 201;
        ctx.body = res.success('保存历史记录成功');
    }
);

// 历史记录列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const permissions = ctx.auth.permissions;
        const userId = ctx.auth.userId;
        const params = VideoHistoryListValidator(ctx.request.query);
        const data = await VideoHistoryService.list({
            id: userId,
            permissions,
            ...params
        });
        ctx.status = 200;
        ctx.body = res.json(data, '历史记录获取成功');
    }
);

module.exports = router;
