const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const UserService = require('@service/client/user');
const auth = require('@middleware/auth');
const {PREFIX, CLIENT_PREFIX} = require('@core/consts');
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

module.exports = router;
