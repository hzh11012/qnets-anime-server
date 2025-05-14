const CLIENT_PREFIX = '/api';

const SERVER_PREFIX = '/api/server';

const ADMIN = 'admin:all';

const PERM = Object.freeze({
    CREATE: 'create',
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
});

module.exports = {
    CLIENT_PREFIX,
    SERVER_PREFIX,
    ADMIN,
    PERM
};
