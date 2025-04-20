const RoleDao = require('@dao/role');

class RoleService {
    static async create(param) {
        try {
            return await RoleDao.create(param);
        } catch (error) {
            throw error;
        }
    }

    static async delete(param) {
        try {
            return await RoleDao.delete(param);
        } catch (error) {
            throw error;
        }
    }

    static async edit(param) {
        try {
            return await RoleDao.edit(param);
        } catch (error) {
            throw error;
        }
    }

    static async list(param) {
        try {
            return await RoleDao.list(param);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleService;
