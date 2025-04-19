const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const PermissionService = require('@service/permission');
const auth = require('@middleware/auth');
const {
    PermissionCreateValidator,
    PermissionListValidator,
    PermissionDeleteValidator
} = require('@validators/permission');
const res = new Resolve();

const router = new Router({
    prefix: '/api/server/permission'
});

// 权限创建
router.post('/create', auth(['admin:all', 'permission:create']), async ctx => {
    const params = PermissionCreateValidator(ctx.request.body);
    await PermissionService.create(params);
    ctx.body = res.success('权限创建成功');
});

// 权限删除
router.post('/delete', auth(['admin:all', 'permission:delete']), async ctx => {
    const params = PermissionDeleteValidator(ctx.request.body);
    await PermissionService.delete(params);
    ctx.body = res.success('权限删除成功');
});

// 权限列表
router.post('/list', auth(['admin:all', 'permission:view']), async ctx => {
    const params = PermissionListValidator(ctx.request.body);
    const list = await PermissionService.list(params);
    ctx.body = res.json(list, '权限获取成功');
});

module.exports = router;
