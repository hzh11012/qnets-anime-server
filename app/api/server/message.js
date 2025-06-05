const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const MessageService = require('@service/server/message');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    MessageListValidator,
    MessageEditValidator,
    MessageDeleteValidator
} = require('@validators/server/message');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'messages';

// 留言删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = MessageDeleteValidator(ctx.params);
        await RoleService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('留言删除成功');
    }
);

// 留言列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = MessageListValidator(ctx.request.query);
        const list = await MessageService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '留言列表获取成功');
    }
);

// 留言编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = MessageEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const data = await MessageService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(data, '留言编辑成功');
    }
);

module.exports = router;
