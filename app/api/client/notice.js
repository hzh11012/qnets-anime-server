const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const NoticeService = require('@service/client/notice');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {NoticeListValidator} = require('@validators/client/notice');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'notices';

// 公告列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = NoticeListValidator(ctx.request.query);
        const list = await NoticeService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '公告列表获取成功');
    }
);

module.exports = router;
