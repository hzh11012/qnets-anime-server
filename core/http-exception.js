class HttpException extends Error {
    constructor(msg = '服务端异常', code = 500) {
        super(msg);
        Object.assign(this, {msg, code});
    }
}

// 定义通用的异常工厂函数
const createHttpException = (defaultMsg, statusCode) =>
    class extends HttpException {
        constructor(msg = defaultMsg) {
            super(msg, statusCode);
        }
    };

// 使用工厂函数创建具体的异常类
const ParameterException = createHttpException('参数错误', 400);
const AuthFailed = createHttpException('未经授权', 401);
const Forbidden = createHttpException('禁止访问', 403);
const NotFound = createHttpException('未找到', 404);
const Existing = createHttpException('已存在', 412);

class Resolve {
    fail(err = {}, msg = 'failed') {
        if (err instanceof HttpException) return err;
        return {msg, err};
    }

    success(msg = 'success', code = 200) {
        return {code, msg};
    }

    json(data, msg = 'success', code = 200) {
        return {code, msg, data};
    }
}

module.exports = {
    HttpException,
    ParameterException,
    AuthFailed,
    NotFound,
    Forbidden,
    Existing,
    Resolve
};
