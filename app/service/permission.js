const PermissionDao = require('@dao/permission');

class PermissionService {
    static async create(param) {
        try {
            return await PermissionDao.create(param);
        } catch (error) {
            throw error;
        }
    }

    static async delete(param) {
        try {
            return await PermissionDao.delete(param);
        } catch (error) {
            throw error;
        }
    }

    static async list(param) {
        try {
            return await PermissionDao.list(param);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PermissionService;
