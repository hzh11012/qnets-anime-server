const UserDao = require('@dao/user');

class UserService {
    static async getInfo(phone) {
        try {
            return await UserDao.findByPhone(phone);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
