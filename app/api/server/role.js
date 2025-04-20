const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const RoleService = require('@service/role');
const auth = require('@middleware/auth');
const {
    RoleCreateValidator,
    RoleDeleteValidator,
    RoleEditValidator,
    RoleListValidator
} = require('@validators/role');
const res = new Resolve();

const router = new Router({
    prefix: '/api/server'
});

const path = '/role';

// 角色创建
router.post(path, auth(['admin:all', 'role:create']), async ctx => {
    const params = RoleCreateValidator(ctx.request.body);
    await RoleService.create(params);
    ctx.body = res.success('角色创建成功');
});

// 角色删除
router.delete(path, auth(['admin:all', 'role:delete']), async ctx => {
    const params = RoleDeleteValidator(ctx.request.body);
    await RoleService.delete(params);
    ctx.body = res.success('角色删除成功');
});

// 角色列表
router.get(path, auth(['admin:all', 'role:view']), async ctx => {
    const params = RoleListValidator(ctx.request.body);
    const list = await RoleService.list(params);
    ctx.body = res.json(list, '角色列表成功');
});

// 角色编辑
router.put(path, auth(['admin:all', 'role:edit']), async ctx => {
    const params = RoleEditValidator(ctx.request.body);
    const role = await RoleService.edit(params);
    ctx.body = res.json(role, '角色编辑成功');
});

module.exports = router;
