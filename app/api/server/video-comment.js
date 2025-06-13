const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const VideoCommentService = require('@service/server/video-comment');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    VideoCommentListValidator,
    VideoCommentEditValidator,
    VideoCommentDeleteValidator
} = require('@validators/server/video-comment');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'video-comments';

// 视频评论删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = VideoCommentDeleteValidator(ctx.params);
        await VideoCommentService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('视频评论删除成功');
    }
);

// 视频评论列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = VideoCommentListValidator(ctx.request.query);
        const list = await VideoCommentService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '视频评论列表获取成功');
    }
);

// 视频编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = VideoCommentEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await VideoCommentService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '视频评论编辑成功');
    }
);

module.exports = router;
