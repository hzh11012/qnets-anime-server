const UserDao = require('@dao/user');

class UserService {
    static async getInfo(email) {
        try {
            return await UserDao.findByEmail(email);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
