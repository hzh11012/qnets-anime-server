const prisma = require('@core/prisma');
const {NotFound, HttpException} = require('@core/http-exception');

class UserDao {
    static async findByPhone(phone) {
        try {
            const user = await prisma.user.findUnique({
                where: {phone}
            });

            if (!user) throw new NotFound('用户不存在');

            return [null, user];
        } catch (err) {
            if (err instanceof HttpException) {
                return [err, null];
            }
            return [new HttpException(), null];
        }
    }
}

module.exports = UserDao;
