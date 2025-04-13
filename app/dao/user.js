const prisma = require('@core/prisma');
const {NotFound} = require('@core/http-exception');

class UserDao {
    static async findByPhone(phone, status = 1) {
        const user = await prisma.user.findUnique({where: {phone, status}});

        if (!user) throw new NotFound('用户不存在');

        return user;
    }
}

module.exports = UserDao;
