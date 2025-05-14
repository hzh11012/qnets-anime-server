const UserDao = require('@dao/user');

class UserService {
    static async getInfo(email) {
        try {
            return await UserDao.findByEmail(email);
        } catch (error) {
            throw error;
        }
    }

    static async list(param) {
        try {
            return await UserDao.list(param);
        } catch (error) {
            throw error;
        }
    }

    static async edit(param) {
        try {
            return await UserDao.edit(param);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
