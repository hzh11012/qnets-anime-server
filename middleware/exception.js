const {HttpException} = require('@core/http-exception');

module.exports = {
    json: (err, ctx) => {
        const baseResponse = {
            request: `${ctx.method}: ${ctx.path}`
        };

        if (err instanceof HttpException) {
            // 已知异常
            ctx.body = {
                ...baseResponse,
                msg: err.msg,
                code: err.code,
                ...(err.data && {data: err.data})
            };
            ctx.status = err.code;
        } else {
            // 未知异常
            console.error(err);
            ctx.body = {
                ...baseResponse,
                msg: '服务端异常',
                code: 500
            };
            ctx.status = 500;
        }
    },
    accepts: () => 'json'
};
