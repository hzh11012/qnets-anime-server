const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoService = require('@service/client/video');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {VideoPlayValidator} = require('@validators/client/video');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'videos';

// 视频播放
router.post(
    `/${PATH}/:id/play`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = VideoPlayValidator(ctx.params);
        await VideoService.incrementPlayCount({userId, ...params});
        ctx.status = 201;
        ctx.body = res.success('视频播放成功');
    }
);

module.exports = router;
