const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const AuthService = require('@service/auth');
const {LoginValidator, PhoneValidator} = require('@validators/auth');
const res = new Resolve();

const router = new Router({
    prefix: '/api/auth'
});

// 用户登录
router.post('/login', async ctx => {
    const {phone, code} = LoginValidator(ctx.request.body);
    await AuthService.login(phone, code, ctx);
    ctx.body = res.success('登录成功');
});

// 发送验证码
router.post('/code', async ctx => {
    const {phone} = PhoneValidator(ctx.request.body);
    await AuthService.sendCode(phone);
    ctx.body = res.success('验证码发送成功');
});

module.exports = router;
