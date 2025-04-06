const UserDao = require('@dao/user');

class UserService {
    static async getInfo(phone) {
        const [err, user] = await UserDao.findByPhone(phone);
        if (err) throw err;

        return user;
    }
}

module.exports = UserService;
