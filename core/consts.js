const PREFIX = '/api';

const CLIENT_PREFIX = '';

const SERVER_PREFIX = 'server';

const ADMIN = 'admin:all';

const PERM = Object.freeze({
    CREATE: 'create',
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
});

const USER_PERMISSIONS = [
    {
        name: '后台页面：用户',
        permission: `${SERVER_PREFIX}:user`
    },
    {
        name: '后台接口：用户编辑',
        permission: `${SERVER_PREFIX}:users:${PERM.EDIT}`
    },
    {
        name: '后台接口：用户查询',
        permission: `${SERVER_PREFIX}:users:${PERM.VIEW}`
    }
];

const ROLE_PERMISSIONS = [
    {
        name: '后台页面：角色',
        permission: `${SERVER_PREFIX}:role`
    },
    {
        name: '后台接口：角色创建',
        permission: `${SERVER_PREFIX}:roles:${PERM.CREATE}`
    },
    {
        name: '后台接口：角色删除',
        permission: `${SERVER_PREFIX}:roles:${PERM.DELETE}`
    },
    {
        name: '后台接口：角色编辑',
        permission: `${SERVER_PREFIX}:roles:${PERM.EDIT}`
    },
    {
        name: '后台接口：角色查询',
        permission: `${SERVER_PREFIX}:roles:${PERM.VIEW}`
    }
];

const PERMISSION_PERMISSIONS = [
    {
        name: '后台页面：权限',
        permission: `${SERVER_PREFIX}:permission`
    },
    {
        name: '后台接口：权限创建',
        permission: `${SERVER_PREFIX}:permissions:${PERM.CREATE}`
    },
    {
        name: '后台接口：权限删除',
        permission: `${SERVER_PREFIX}:permissions:${PERM.DELETE}`
    },
    {
        name: '后台接口：权限查询',
        permission: `${SERVER_PREFIX}:permissions:${PERM.VIEW}`
    }
];

const COLLECTION_PERMISSIONS = [
    {
        name: '后台页面：收藏',
        permission: `${SERVER_PREFIX}:collection`
    },
    {
        name: '后台接口：动漫收藏删除',
        permission: `${SERVER_PREFIX}:anime-collections:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫收藏查询',
        permission: `${SERVER_PREFIX}:anime-collections:${PERM.VIEW}`
    }
];

const RATING_PERMISSIONS = [
    {
        name: '后台页面：评分',
        permission: `${SERVER_PREFIX}:rating`
    },
    {
        name: '后台接口：动漫评分删除',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫评分编辑',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.EDIT}`
    },
    {
        name: '后台接口：动漫评分查询',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.VIEW}`
    }
];

const MESSAGE_PERMISSIONS = [
    {
        name: '后台页面：平台留言',
        permission: `${SERVER_PREFIX}:message`
    },
    {
        name: '后台接口：留言删除',
        permission: `${SERVER_PREFIX}:messages:${PERM.DELETE}`
    },
    {
        name: '后台接口：留言编辑',
        permission: `${SERVER_PREFIX}:messages:${PERM.EDIT}`
    },
    {
        name: '后台接口：留言查询',
        permission: `${SERVER_PREFIX}:messages:${PERM.VIEW}`
    }
];

const BANNER_PERMISSIONS = [
    {
        name: '后台页面：站点轮播',
        permission: `${SERVER_PREFIX}:banner`
    },
    {
        name: '后台接口：动漫轮播创建',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫轮播删除',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫轮播查询',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.VIEW}`
    }
];

const GUIDE_PERMISSIONS = [
    {
        name: '后台页面：新番导视',
        permission: `${SERVER_PREFIX}:guide`
    },
    {
        name: '后台接口：新番导视创建',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.CREATE}`
    },
    {
        name: '后台接口：新番导视删除',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.DELETE}`
    },
    {
        name: '后台接口：新番导视编辑',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.EDIT}`
    },
    {
        name: '后台接口：新番导视查询',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.VIEW}`
    }
];

const RECOMMEND_PERMISSIONS = [
    {
        name: '后台页面：每周推荐',
        permission: `${SERVER_PREFIX}:recommend`
    },
    {
        name: '后台接口：动漫推荐创建',
        permission: `${SERVER_PREFIX}:anime-recommends:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫推荐删除',
        permission: `${SERVER_PREFIX}:anime-recommends:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫推荐编辑',
        permission: `${SERVER_PREFIX}:anime-recommends:${PERM.EDIT}`
    },
    {
        name: '后台接口：动漫推荐查询',
        permission: `${SERVER_PREFIX}:anime-recommends:${PERM.VIEW}`
    }
];

const SERIES_PERMISSIONS = [
    {
        name: '后台页面：系列',
        permission: `${SERVER_PREFIX}:series`
    },
    {
        name: '后台接口：动漫系列创建',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫系列删除',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫系列查询',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.VIEW}`
    }
];

const ANIME_PERMISSIONS = [
    {
        name: '后台页面：动漫',
        permission: `${SERVER_PREFIX}:anime`
    },
    {
        name: '后台接口：动漫创建',
        permission: `${SERVER_PREFIX}:animes:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫删除',
        permission: `${SERVER_PREFIX}:animes:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫编辑',
        permission: `${SERVER_PREFIX}:animes:${PERM.EDIT}`
    },
    {
        name: '后台接口：动漫查询',
        permission: `${SERVER_PREFIX}:animes:${PERM.VIEW}`
    }
];

const VIDEO_PERMISSIONS = [
    {
        name: '后台页面：视频',
        permission: `${SERVER_PREFIX}:video`
    },
    {
        name: '后台接口：视频创建',
        permission: `${SERVER_PREFIX}:videos:${PERM.CREATE}`
    },
    {
        name: '后台接口：视频删除',
        permission: `${SERVER_PREFIX}:videos:${PERM.DELETE}`
    },
    {
        name: '后台接口：视频编辑',
        permission: `${SERVER_PREFIX}:videos:${PERM.EDIT}`
    },
    {
        name: '后台接口：视频查询',
        permission: `${SERVER_PREFIX}:videos:${PERM.VIEW}`
    }
];

const TAG_PERMISSIONS = [
    {
        name: '后台页面：分类',
        permission: `${SERVER_PREFIX}:tag`
    },
    {
        name: '后台接口：动漫分类创建',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.CREATE}`
    },
    {
        name: '后台接口：动漫分类删除',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.DELETE}`
    },
    {
        name: '后台接口：动漫分类查询',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.VIEW}`
    }
];

const NOTICE_PERMISSIONS = [
    {
        name: '后台页面：系统公告',
        permission: `${SERVER_PREFIX}:notice`
    },
    {
        name: '后台接口：公告创建',
        permission: `${SERVER_PREFIX}:notices:${PERM.CREATE}`
    },
    {
        name: '后台接口：公告删除',
        permission: `${SERVER_PREFIX}:notices:${PERM.DELETE}`
    },
    {
        name: '后台接口：公告删除',
        permission: `${SERVER_PREFIX}:notices:${PERM.EDIT}`
    },
    {
        name: '后台接口：公告查询',
        permission: `${SERVER_PREFIX}:notices:${PERM.VIEW}`
    }
];

const INIT_SERVER_PERMISSIONS = [
    ...USER_PERMISSIONS,
    ...ROLE_PERMISSIONS,
    ...PERMISSION_PERMISSIONS,
    ...COLLECTION_PERMISSIONS,
    ...RATING_PERMISSIONS,
    ...MESSAGE_PERMISSIONS,
    ...BANNER_PERMISSIONS,
    ...GUIDE_PERMISSIONS,
    ...RECOMMEND_PERMISSIONS,
    ...SERIES_PERMISSIONS,
    ...ANIME_PERMISSIONS,
    ...VIDEO_PERMISSIONS,
    ...TAG_PERMISSIONS,
    ...NOTICE_PERMISSIONS
];

const INIT_CLIENT_PERMISSIONS = [];

const INIT_PERMISSIONS = [
    ...INIT_SERVER_PERMISSIONS,
    ...INIT_CLIENT_PERMISSIONS,
    {name: '所有权限', permission: ADMIN}
];

module.exports = {
    PREFIX,
    CLIENT_PREFIX,
    SERVER_PREFIX,
    ADMIN,
    PERM,
    INIT_PERMISSIONS
};
