const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const UserService = require('@service/server/user');
const auth = require('@middleware/auth');
const {PREFIX, SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    UserListValidator,
    UserEditValidator
} = require('@validators/server/user');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${SERVER_PREFIX}`
});

const PATH = 'users';

// 用户信息
router.get(`/${PATH}/me`, auth(), async ctx => {
    const {email} = ctx.auth;
    const info = await UserService.info(email);
    ctx.status = 200;
    ctx.body = res.json(info, '获取信息成功');
});

// 用户列表
router.get(
    `/${PATH}`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.VIEW}`]),
    async ctx => {
        const params = UserListValidator(ctx.request.query);
        const list = await UserService.list(params);
        ctx.status = 200;
        ctx.body = res.json(list, '用户列表获取成功');
    }
);

// 用户编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${SERVER_PREFIX}:${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = UserEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const {email} = ctx.auth;
        const data = await UserService.edit({...params, email});
        ctx.status = 201;
        ctx.body = res.json(data, '用户编辑成功');
    }
);

module.exports = router;
