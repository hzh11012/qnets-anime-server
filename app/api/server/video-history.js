const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoHistoryService = require('@service/server/video-history');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    VideoHistoryListValidator,
    VideoHistoryDeleteValidator
} = require('@validators/server/video-history');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'video-histories';

// 历史播放记录删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = VideoHistoryDeleteValidator(ctx.params);
        await VideoHistoryService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('历史播放记录删除成功');
    }
);

// 历史播放记录列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = VideoHistoryListValidator(ctx.request.query);
        const list = await VideoHistoryService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '历史播放记录列表获取成功');
    }
);

module.exports = router;
