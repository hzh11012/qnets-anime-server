const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        });

        this.redis.on('error', err => {
            console.error('无法连接到Redis:', err);
        });

        this.redis.on('ready', () => {
            console.log('已成功连接到Redis');
        });
    }

    async executeCommand(operation, ...args) {
        try {
            return await operation.apply(this.redis, args);
        } catch (err) {
            console.error(`Redis操作失败: ${err.message}`);
        }
    }

    async get(key) {
        return await this.executeCommand(this.redis.get, key);
    }

    async set(key, value, expireTime = null) {
        const args = [key, value];
        if (expireTime) args.push('EX', expireTime);
        return await this.executeCommand(this.redis.set, ...args);
    }

    async del(key) {
        return await this.executeCommand(this.redis.del, key);
    }

    async exists(key) {
        return await this.executeCommand(this.redis.exists, key);
    }
}

module.exports = new RedisService();
