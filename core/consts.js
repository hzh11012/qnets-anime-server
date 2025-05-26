const CLIENT_PREFIX = '/api';

const SERVER_PREFIX = '/api/server';

const ADMIN = 'admin:all';

const PERM = Object.freeze({
    CREATE: 'create',
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
});

const INIT_PERMISSIONS = [
    {name: '所有权限', permission: ADMIN},
    // 用户相关
    {name: '后台接口：用户编辑', permission: `users:${PERM.EDIT}`},
    {name: '后台接口：用户查询', permission: `users:${PERM.VIEW}`},
    // 角色相关
    {name: '后台接口：角色创建', permission: `roles:${PERM.CREATE}`},
    {name: '后台接口：角色删除', permission: `roles:${PERM.DELETE}`},
    {name: '后台接口：角色编辑', permission: `roles:${PERM.EDIT}`},
    {name: '后台接口：角色查询', permission: `roles:${PERM.VIEW}`},
    // 权限相关
    {name: '后台接口：权限创建', permission: `permissions:${PERM.CREATE}`},
    {name: '后台接口：权限删除', permission: `permissions:${PERM.DELETE}`},
    {name: '后台接口：权限查询', permission: `permissions:${PERM.VIEW}`},
    // 留言相关
    {name: '后台接口：留言删除', permission: `messages:${PERM.DELETE}`},
    {name: '后台接口：留言编辑', permission: `messages:${PERM.EDIT}`},
    {name: '后台接口：留言查询', permission: `messages:${PERM.VIEW}`},
    // 动漫相关
    {name: '后台接口：动漫创建', permission: `anime:${PERM.CREATE}`},
    {name: '后台接口：动漫删除', permission: `anime:${PERM.DELETE}`},
    {name: '后台接口：动漫编辑', permission: `anime:${PERM.EDIT}`},
    {name: '后台接口：动漫查询', permission: `anime:${PERM.VIEW}`},
    // 动漫分类相关
    {name: '后台接口：动漫分类创建', permission: `anime-tags:${PERM.CREATE}`},
    {name: '后台接口：动漫分类删除', permission: `anime-tags:${PERM.DELETE}`},
    {name: '后台接口：动漫分类查询', permission: `anime-tags:${PERM.VIEW}`},
    // 动漫系列相关
    {name: '后台接口：动漫系列创建', permission: `anime-series:${PERM.CREATE}`},
    {name: '后台接口：动漫系列删除', permission: `anime-series:${PERM.DELETE}`},
    {name: '后台接口：动漫系列查询', permission: `anime-series:${PERM.VIEW}`},
    // 动漫轮播相关
    {
        name: '后台接口：动漫轮播创建',
        permission: `anime-banners:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫轮播删除',
        permission: `anime-banners:${PERM.DELETE}`
    },
    {name: '后台接口：动漫轮播查询', permission: `anime-banners:${PERM.VIEW}`}
];

module.exports = {
    CLIENT_PREFIX,
    SERVER_PREFIX,
    ADMIN,
    PERM,
    INIT_PERMISSIONS
};
