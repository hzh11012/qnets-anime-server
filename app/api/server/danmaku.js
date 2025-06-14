const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const DanmakuService = require('@service/server/danmaku');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    DanmakuListValidator,
    DanmakuDeleteValidator
} = require('@validators/server/danmaku');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'danmakus';

// 弹幕删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = DanmakuDeleteValidator(ctx.params);
        await DanmakuService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('弹幕删除成功');
    }
);

// 弹幕列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = DanmakuListValidator(ctx.request.query);
        const list = await DanmakuService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '弹幕列表获取成功');
    }
);

module.exports = router;
