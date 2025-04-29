require('module-alias/register');

const Koa = require('koa');
const {onerror} = require('koa-onerror');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');
const InitManager = require('@core/init');
const errorConf = require('@middleware/exception');
const dotenv = require('dotenv');
const {createServer} = require('http');
const paginationParser = require('@middleware/pagination');

dotenv.config({path: '.env'});

const redis = require('@core/redis');

const app = new Koa({proxy: true});

app.use(cors());
onerror(app, errorConf);
app.use(parser());

// 接口调用频率限制（Rate-Limiting）
// https://github.com/koajs/ratelimit
app.use(
    ratelimit({
        driver: 'redis',
        db: redis.redis,
        duration: 60000,
        errorMessage: '访问频率过高，请稍后再试',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 50,
        disableHeader: false,
        whitelist: () => {},
        blacklist: () => {}
    })
);

// routes自动注册
InitManager.initCore(app);

app.use(paginationParser);

const httpServer = createServer(app.callback());

httpServer.listen(process.env.NODE_PORT, () =>
    console.log(
        `当前 Node.js 服务已启动，地址: http://localhost:${process.env.NODE_PORT}`
    )
);

module.exports = httpServer;
