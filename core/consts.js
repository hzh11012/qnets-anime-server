const PREFIX = '/api';

const CLIENT_PREFIX = 'client';

const SERVER_PREFIX = 'server';

const ADMIN = 'admin:all';

const DEFAULT_USER = '917944345@qq.com';

const PERM = Object.freeze({
    CREATE: 'create',
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
});

const INIT_ANIME_TAGS = [
    {name: '原创'},
    {name: '漫画改'},
    {name: '小说改'},
    {name: '游戏改'},
    {name: '特摄'},
    {name: '热血'},
    {name: '穿越'},
    {name: '奇幻'},
    {name: '战斗'},
    {name: '玄幻'},
    {name: '搞笑'},
    {name: '日常'},
    {name: '科幻'},
    {name: '武侠'},
    {name: '萌系'},
    {name: '治愈'},
    {name: '校园'},
    {name: '少儿'},
    {name: '泡面'},
    {name: '悬疑'},
    {name: '恋爱'},
    {name: '少女'},
    {name: '魔法'},
    {name: '冒险'},
    {name: '历史'},
    {name: '架空'},
    {name: '机战'},
    {name: '神魔'},
    {name: '声控'},
    {name: '运动'},
    {name: '励志'},
    {name: '音乐'},
    {name: '推理'},
    {name: '社团'},
    {name: '智斗'},
    {name: '催泪'},
    {name: '美食'},
    {name: '偶像'},
    {name: '乙女'},
    {name: '职场'},
    {name: '古风'}
];

const USER_PERMISSIONS = [
    {
        name: '后台页面：用户',
        permission: `${SERVER_PREFIX}:user`,
        system: 1
    },
    {
        name: '后台接口：用户编辑',
        permission: `${SERVER_PREFIX}:users:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：用户查询',
        permission: `${SERVER_PREFIX}:users:${PERM.VIEW}`,
        system: 1
    }
];

const ROLE_PERMISSIONS = [
    {
        name: '后台页面：角色',
        permission: `${SERVER_PREFIX}:role`,
        system: 1
    },
    {
        name: '后台接口：角色创建',
        permission: `${SERVER_PREFIX}:roles:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：角色删除',
        permission: `${SERVER_PREFIX}:roles:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：角色编辑',
        permission: `${SERVER_PREFIX}:roles:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：角色查询',
        permission: `${SERVER_PREFIX}:roles:${PERM.VIEW}`,
        system: 1
    }
];

const PERMISSION_PERMISSIONS = [
    {
        name: '后台页面：权限',
        permission: `${SERVER_PREFIX}:permission`,
        system: 1
    },
    {
        name: '后台接口：权限创建',
        permission: `${SERVER_PREFIX}:permissions:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：权限删除',
        permission: `${SERVER_PREFIX}:permissions:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：权限查询',
        permission: `${SERVER_PREFIX}:permissions:${PERM.VIEW}`,
        system: 1
    }
];

const COLLECTION_PERMISSIONS = [
    {
        name: '后台页面：收藏',
        permission: `${SERVER_PREFIX}:collection`,
        system: 1
    },
    {
        name: '后台接口：动漫收藏删除',
        permission: `${SERVER_PREFIX}:anime-collections:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫收藏查询',
        permission: `${SERVER_PREFIX}:anime-collections:${PERM.VIEW}`,
        system: 1
    }
];

const RATING_PERMISSIONS = [
    {
        name: '后台页面：评分',
        permission: `${SERVER_PREFIX}:rating`,
        system: 1
    },
    {
        name: '后台接口：动漫评分删除',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫评分编辑',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：动漫评分查询',
        permission: `${SERVER_PREFIX}:anime-ratings:${PERM.VIEW}`,
        system: 1
    }
];

const MESSAGE_PERMISSIONS = [
    {
        name: '后台页面：平台留言',
        permission: `${SERVER_PREFIX}:message`,
        system: 1
    },
    {
        name: '后台接口：留言删除',
        permission: `${SERVER_PREFIX}:messages:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：留言编辑',
        permission: `${SERVER_PREFIX}:messages:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：留言查询',
        permission: `${SERVER_PREFIX}:messages:${PERM.VIEW}`,
        system: 1
    }
];

const BANNER_PERMISSIONS = [
    {
        name: '后台页面：站点轮播',
        permission: `${SERVER_PREFIX}:banner`,
        system: 1
    },
    {
        name: '后台接口：动漫轮播创建',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：动漫轮播删除',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫轮播查询',
        permission: `${SERVER_PREFIX}:anime-banners:${PERM.VIEW}`,
        system: 1
    }
];

const GUIDE_PERMISSIONS = [
    {
        name: '后台页面：新番导视',
        permission: `${SERVER_PREFIX}:guide`,
        system: 1
    },
    {
        name: '后台接口：新番导视创建',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：新番导视删除',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：新番导视编辑',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：新番导视查询',
        permission: `${SERVER_PREFIX}:anime-guides:${PERM.VIEW}`,
        system: 1
    }
];

const TOPIC_PERMISSIONS = [
    {
        name: '后台页面：每周推荐',
        permission: `${SERVER_PREFIX}:topic`,
        system: 1
    },
    {
        name: '后台接口：动漫专题创建',
        permission: `${SERVER_PREFIX}:anime-topics:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：动漫专题删除',
        permission: `${SERVER_PREFIX}:anime-topics:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫专题编辑',
        permission: `${SERVER_PREFIX}:anime-topics:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：动漫专题查询',
        permission: `${SERVER_PREFIX}:anime-topics:${PERM.VIEW}`,
        system: 1
    }
];

const SERIES_PERMISSIONS = [
    {
        name: '后台页面：系列',
        permission: `${SERVER_PREFIX}:series`,
        system: 1
    },
    {
        name: '后台接口：动漫系列创建',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：动漫系列删除',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫系列查询',
        permission: `${SERVER_PREFIX}:anime-series:${PERM.VIEW}`,
        system: 1
    }
];

const ANIME_PERMISSIONS = [
    {
        name: '后台页面：动漫',
        permission: `${SERVER_PREFIX}:anime`,
        system: 1
    },
    {
        name: '后台接口：动漫创建',
        permission: `${SERVER_PREFIX}:animes:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：动漫删除',
        permission: `${SERVER_PREFIX}:animes:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫编辑',
        permission: `${SERVER_PREFIX}:animes:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：动漫查询',
        permission: `${SERVER_PREFIX}:animes:${PERM.VIEW}`,
        system: 1
    }
];

const VIDEO_PERMISSIONS = [
    {
        name: '后台页面：视频',
        permission: `${SERVER_PREFIX}:video`,
        system: 1
    },
    {
        name: '后台接口：视频创建',
        permission: `${SERVER_PREFIX}:videos:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：视频删除',
        permission: `${SERVER_PREFIX}:videos:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：视频编辑',
        permission: `${SERVER_PREFIX}:videos:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：视频查询',
        permission: `${SERVER_PREFIX}:videos:${PERM.VIEW}`,
        system: 1
    }
];

const TAG_PERMISSIONS = [
    {
        name: '后台页面：分类',
        permission: `${SERVER_PREFIX}:tag`,
        system: 1
    },
    {
        name: '后台接口：动漫分类创建',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：动漫分类删除',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：动漫分类查询',
        permission: `${SERVER_PREFIX}:anime-tags:${PERM.VIEW}`,
        system: 1
    }
];

const NOTICE_PERMISSIONS = [
    {
        name: '后台页面：系统公告',
        permission: `${SERVER_PREFIX}:notice`,
        system: 1
    },
    {
        name: '后台接口：公告创建',
        permission: `${SERVER_PREFIX}:notices:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '后台接口：公告删除',
        permission: `${SERVER_PREFIX}:notices:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：公告删除',
        permission: `${SERVER_PREFIX}:notices:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：公告查询',
        permission: `${SERVER_PREFIX}:notices:${PERM.VIEW}`,
        system: 1
    }
];

const COMMENT_PERMISSIONS = [
    {
        name: '后台页面：评论',
        permission: `${SERVER_PREFIX}:comment`,
        system: 1
    },
    {
        name: '后台接口：视频评论删除',
        permission: `${SERVER_PREFIX}:video-comments:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：视频评论编辑',
        permission: `${SERVER_PREFIX}:video-comments:${PERM.EDIT}`,
        system: 1
    },
    {
        name: '后台接口：视频评论查询',
        permission: `${SERVER_PREFIX}:video-comments:${PERM.VIEW}`,
        system: 1
    }
];

const DANMAKU_PERMISSIONS = [
    {
        name: '后台页面：弹幕',
        permission: `${SERVER_PREFIX}:danmaku`,
        system: 1
    },
    {
        name: '后台接口：弹幕删除',
        permission: `${SERVER_PREFIX}:danmakus:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：弹幕查询',
        permission: `${SERVER_PREFIX}:danmakus:${PERM.VIEW}`,
        system: 1
    }
];

const HISTORY_PERMISSIONS = [
    {
        name: '后台页面：历史播放',
        permission: `${SERVER_PREFIX}:history`,
        system: 1
    },
    {
        name: '后台接口：历史播放删除',
        permission: `${SERVER_PREFIX}:video-histories:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '后台接口：历史播放查询',
        permission: `${SERVER_PREFIX}:video-histories:${PERM.VIEW}`,
        system: 1
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
    ...TOPIC_PERMISSIONS,
    ...SERIES_PERMISSIONS,
    ...ANIME_PERMISSIONS,
    ...VIDEO_PERMISSIONS,
    ...TAG_PERMISSIONS,
    ...NOTICE_PERMISSIONS,
    ...COMMENT_PERMISSIONS,
    ...DANMAKU_PERMISSIONS,
    ...HISTORY_PERMISSIONS
];

const ANIEM_TYPE_4_PERMISSION = {
    name: '动漫类型：里番',
    permission: `${CLIENT_PREFIX}:anime-type-4:${PERM.VIEW}`,
    system: 1
};

const CLIENT_API_PERMISSIONS = [
    {
        name: '前台接口：动漫轮播查询',
        permission: `${CLIENT_PREFIX}:anime-banners:${PERM.VIEW}`,
        system: 1
    },
    {
        name: '前台接口：动漫系列查询',
        permission: `${CLIENT_PREFIX}:anime-series:${PERM.VIEW}`,
        system: 1
    },
    {
        // 包含 首页动漫、动漫搜索、热榜
        name: '前台接口：动漫查询',
        permission: `${CLIENT_PREFIX}:animes:${PERM.VIEW}`,
        system: 1
    },
    {
        // 包含 首页动漫专题、动漫专题查询
        name: '前台接口：动漫专题查询',
        permission: `${CLIENT_PREFIX}:anime-topics:${PERM.VIEW}`,
        system: 1
    },
    {
        // 包含 首页我的追番，追番查询
        name: '前台接口：动漫收藏查询',
        permission: `${CLIENT_PREFIX}:anime-collections:${PERM.VIEW}`,
        system: 1
    },
    {
        name: '前台接口：追番',
        permission: `${CLIENT_PREFIX}:anime-collections:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '前台接口：取消追番',
        permission: `${CLIENT_PREFIX}:anime-collections:${PERM.DELETE}`,
        system: 1
    },
    {
        name: '前台接口：视频弹幕获取',
        permission: `${CLIENT_PREFIX}:danmakus:${PERM.VIEW}`,
        system: 1
    },
    {
        name: '前台接口：视频弹幕发送',
        permission: `${CLIENT_PREFIX}:danmakus:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '前台接口：动漫评分',
        permission: `${CLIENT_PREFIX}:anime-ratings:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '前台接口：系统公告',
        permission: `${CLIENT_PREFIX}:notices:${PERM.VIEW}`,
        system: 1
    },
    {
        name: '前台接口：创建留言',
        permission: `${CLIENT_PREFIX}:messages:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '前台接口：添加播放量',
        permission: `${CLIENT_PREFIX}:videos:${PERM.CREATE}`,
        system: 1
    },
    {
        name: '前台接口：保存历史记录',
        permission: `${CLIENT_PREFIX}:video-histories:${PERM.CREATE}`,
        system: 1
    }
];

const INIT_CLIENT_PERMISSIONS = [...CLIENT_API_PERMISSIONS];

const INIT_PERMISSIONS = [
    ...INIT_SERVER_PERMISSIONS,
    ...INIT_CLIENT_PERMISSIONS,
    ANIEM_TYPE_4_PERMISSION,
    {name: '所有权限', permission: ADMIN, system: 1}
];

module.exports = {
    PREFIX,
    CLIENT_PREFIX,
    SERVER_PREFIX,
    ADMIN,
    PERM,
    DEFAULT_USER,
    INIT_PERMISSIONS,
    INIT_ANIME_TAGS,
    ANIEM_TYPE_4_PERMISSION
};
