const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.connectionOptions = {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: times => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            reconnectOnError: err => {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            }
        };

        this.connect();
    }

    connect() {
        if (this.redis) {
            return;
        }

        this.redis = new Redis(this.connectionOptions);

        this.redis.on('ready', () => {
            console.log('已成功连接到Redis');
        });

        this.redis.on('error', err => {
            console.error('无法连接到Redis:', err);
        });
    }

    async executeCommand(operation, ...args) {
        if (!this.redis) {
            this.connect();
        }

        try {
            return await operation.apply(this.redis, args);
        } catch (err) {
            console.error(`Redis操作失败: ${err.message}`);
            throw err;
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

const redis = new RedisService();

module.exports = redis;
