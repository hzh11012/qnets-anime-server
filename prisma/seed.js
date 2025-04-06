require('module-alias/register');

const prisma = require('@core/prisma');

async function main() {
    // 创建默认权限
    await prisma.permission.createMany({
        data: [{name: '所有权限', permission: 'admin:all'}],
        skipDuplicates: true
    });

    // 创建默认角色
    await prisma.role.upsert({
        where: {role: 'admin'},
        update: {},
        create: {
            name: '管理员',
            role: 'admin',
            permissions: {
                connect: [{permission: 'admin:all'}]
            }
        }
    });

    // 创建默认用户
    await prisma.user.upsert({
        where: {phone: '18749146387'},
        update: {},
        create: {
            phone: '18749146387',
            nickname: 'Qnets',
            roles: {connect: [{role: 'admin'}]}
        }
    });
}

main();
