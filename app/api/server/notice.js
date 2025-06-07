const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const NoticeService = require('@service/server/notice');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    NoticeCreateValidator,
    NoticeDeleteValidator,
    NoticeEditValidator,
    NoticeListValidator
} = require('@validators/server/notice');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'notices';

// 公告创建
router.post(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const params = NoticeCreateValidator(ctx.request.body);
        await NoticeService.create(params);
        ctx.status = 201;
        ctx.body = res.success('公告创建成功');
    }
);

// 公告删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = NoticeDeleteValidator(ctx.params);
        await NoticeService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('公告删除成功');
    }
);

// 公告列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = NoticeListValidator(ctx.request.query);
        const list = await NoticeService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '公告列表获取成功');
    }
);

// 公告编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = NoticeEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await NoticeService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '公告编辑成功');
    }
);

module.exports = router;
