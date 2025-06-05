const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoService = require('@service/server/video');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    VideoCreateValidator,
    VideoListValidator,
    VideoEditValidator,
    VideoDeleteValidator
} = require('@validators/server/video');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'videos';

// 视频创建
router.post(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const params = VideoCreateValidator(ctx.request.body);
        await VideoService.create(params);
        ctx.status = 201;
        ctx.body = res.success('视频创建成功');
    }
);

// 视频删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = VideoDeleteValidator(ctx.params);
        await VideoService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('视频删除成功');
    }
);

// 视频列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = VideoListValidator(ctx.request.query);
        const list = await VideoService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '视频列表获取成功');
    }
);

// 视频编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = VideoEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await VideoService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '视频编辑成功');
    }
);

module.exports = router;
