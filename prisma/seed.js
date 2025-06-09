require('module-alias/register');

const prisma = require('@core/prisma');
const {INIT_PERMISSIONS, ADMIN, DEFAULT_USER} = require('@core/consts');

async function main() {
    // 创建默认权限
    await prisma.permission.createMany({
        data: INIT_PERMISSIONS,
        skipDuplicates: true
    });

    // 创建默认角色
    await prisma.role.upsert({
        where: {role: 'admin'},
        update: {},
        create: {
            name: '管理员',
            role: 'admin',
            permissions: {connect: [{permission: ADMIN}]}
        }
    });

    // 创建默认用户
    await prisma.user.upsert({
        where: {email: DEFAULT_USER},
        update: {},
        create: {
            email: DEFAULT_USER,
            nickname: 'Qnets',
            roles: {connect: [{role: 'admin'}]}
        }
    });
}

main();
