const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const auth = require('@middleware/auth');
const UserService = require('@service/user');
const res = new Resolve();

const router = new Router({
    prefix: '/api/user'
});

// 用户信息
router.get('/info', auth(['info:read', 'admin:all']), async ctx => {
    const {phone} = ctx.auth;
    const info = await UserService.getInfo(phone);
    ctx.body = res.json(info, '获取信息成功');
});

module.exports = router;
