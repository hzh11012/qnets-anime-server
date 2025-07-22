const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const DanmakuService = require('@service/client/danmaku');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    DanmakuCreateValidator,
    DanmakuListValidator
} = require('@validators/client/danmaku');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'danmakus';

// 视频弹幕列表
router.get(
    `/${PATH}/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = DanmakuListValidator(ctx.params);
        const list = await DanmakuService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '视频弹幕获取成功');
    }
);

// 发送弹幕
router.post(
    `/${PATH}/:id`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const params = DanmakuCreateValidator(
            Object.assign(ctx.params, ctx.request.body)
        );

        const {id, ...rest} = params;
        await DanmakuService.create({
            userId: ctx.auth.userId,
            videoId: params.id,
            ...rest
        });
        ctx.status = 201;
        ctx.body = res.success('弹幕发送成功');
    }
);

module.exports = router;
