const Router = require('koa-router');
const {Resolve} = require('@core/http-exception');
const PermissionService = require('@service/permission');
const auth = require('@middleware/auth');
const {SERVER_PREFIX, ADMIN, PERM} = require('@core/consts');
const {
    PermissionCreateValidator,
    PermissionListValidator,
    PermissionDeleteValidator
} = require('@validators/permission');
const res = new Resolve();

const router = new Router({
    prefix: SERVER_PREFIX
});

const PATH = 'permissions';

// 权限创建
router.post(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.CREATE}`]), async ctx => {
    const params = PermissionCreateValidator(ctx.request.body);
    await PermissionService.create(params);
    ctx.status = 201;
    ctx.body = res.success('权限创建成功');
});

// 权限删除
router.delete(
    `/${PATH}/:id`,
    auth([ADMIN, `${PATH}:${PERM.DELETE}`]),
    async ctx => {
        const params = PermissionDeleteValidator(ctx.params);
        await PermissionService.delete(params);
        ctx.status = 204;
        ctx.body = res.success('权限删除成功');
    }
);

// 权限列表
router.get(`/${PATH}`, auth([ADMIN, `${PATH}:${PERM.VIEW}`]), async ctx => {
    const params = PermissionListValidator(ctx.request.query);
    const list = await PermissionService.list(params);
    ctx.status = 200;
    ctx.body = res.json(list, '权限列表获取成功');
});

module.exports = router;
