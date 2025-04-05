require('module-alias/register');

const prisma = require('@core/prisma');

async function main() {
    // 创建默认权限
    await prisma.permission.createMany({
        data: [
            {name: '查看用户', permission: 'user:read'},
            {name: '创建用户', permission: 'user:create'},
            {name: '编辑用户', permission: 'user:edit'},
            {name: '删除用户', permission: 'user:delete'}
        ],
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
                connect: [
                    {permission: 'user:read'},
                    {permission: 'user:create'},
                    {permission: 'user:edit'},
                    {permission: 'user:delete'}
                ]
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
