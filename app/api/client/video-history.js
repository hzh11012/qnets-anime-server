const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoHistoryService = require('@service/client/video-history');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    VideoHistoryCreatValidator
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

module.exports = router;
