const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const MessageService = require('@service/client/message');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX, ADMIN, PERM} = require('@core/consts');
const {MessageCreateValidator} = require('@validators/client/message');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'messages';

// 留言创建
router.post(
    `/${PATH}`,
    auth([ADMIN, `${CLIENT_PREFIX}:${PATH}:${PERM.CREATE}`]),
    async ctx => {
        const userId = ctx.auth.userId;
        const params = MessageCreateValidator(ctx.request.body);
        await MessageService.create({
            userId,
            ...params
        });
        ctx.status = 201;
        ctx.body = res.success('留言创建成功');
    }
);

module.exports = router;
