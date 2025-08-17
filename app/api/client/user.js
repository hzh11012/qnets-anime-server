const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const UserService = require('@service/client/user');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX} = require('@core/consts');
const {UserEditValidator} = require('@validators/client/user');
const res = new Resolve();

const router = new Router({
    prefix: `${PREFIX}/${CLIENT_PREFIX}`
});

const PATH = 'users';

// 用户信息
router.get(`/${PATH}/me`, auth(), async ctx => {
    const {email} = ctx.auth;
    const info = await UserService.info(email);
    ctx.status = 200;
    ctx.body = res.json(info, '获取信息成功');
});

// 用户编辑
router.patch(`/${PATH}`, auth(), async ctx => {
    const params = UserEditValidator(ctx.request.body);
    const {email} = ctx.auth;
    await UserService.edit({...params, email});
    ctx.status = 201;
    ctx.body = res.json('编辑信息成功');
});

module.exports = router;
