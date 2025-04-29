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
    prefix: '/api/server'
});

const path = '/permission';

// 权限创建
router.post(path, auth(['admin:all', 'permission:create']), async ctx => {
    const params = PermissionCreateValidator(ctx.request.body);
    await PermissionService.create(params);
    ctx.body = res.success('权限创建成功');
});

// 权限删除
router.delete(path, auth(['admin:all', 'permission:delete']), async ctx => {
    const params = PermissionDeleteValidator(ctx.request.body);
    await PermissionService.delete(params);
    ctx.body = res.success('权限删除成功');
});

// 权限列表
router.get(path, auth(['admin:all', 'permission:view']), async ctx => {
    const params = PermissionListValidator(ctx.request.query);
    const list = await PermissionService.list(params);
    ctx.body = res.json(list, '权限列表获取成功');
});

module.exports = router;
