const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const RoleService = require('@service/role');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    RoleCreateValidator,
    RoleDeleteValidator,
    RoleEditValidator,
    RoleListValidator
} = require('@validators/role');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'roles';

// 角色创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = RoleCreateValidator(ctx.request.body);
    await RoleService.create(params);
    ctx.status = 201;
    ctx.body = res.success('角色创建成功');
});

// 角色删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = RoleDeleteValidator(ctx.params);
        await RoleService.delete(params);
        ctx.status = 200;
        ctx.body = res.success('角色删除成功');
    }
);

// 角色列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = RoleListValidator(ctx.request.query);
    const list = await RoleService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '角色列表获取成功');
});

// 角色编辑
router.patch(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.EDIT}`]),
    async ctx => {
        const params = RoleEditValidator(
            Object.assign(ctx.params, ctx.request.body)
        );
        const role = await RoleService.edit(params);
        ctx.status = 201;
        ctx.body = res.json(role, '角色编辑成功');
    }
);

module.exports = router;
