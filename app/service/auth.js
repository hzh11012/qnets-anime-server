const {got} = require('got-cjs');
const {HttpException} = require('@core/http-exception');

class AuthService {
    static async sendCode(phone) {
        try {
            const url = `${process.env.SSO_BASE_URL}/api/sso/code`;
            await got.post(url, {json: {phone}}).json();
        } catch (err) {
            this.handleError(err);
        }
    }

    static async login(phone, code, ctx) {
        try {
            const url = `${process.env.SSO_BASE_URL}/api/sso/login`;
            const response = await got.post(url, {json: {phone, code}});

            if (response.statusCode === 200) {
                // 从 SSO 响应头中获取 set-cookie
                const setCookieHeader = response.headers['set-cookie'];
                ctx.set('Set-Cookie', setCookieHeader);
            }
        } catch (err) {
            this.handleError(err);
        }
    }

    static async refreshTokens(token, ctx) {
        try {
            const url = `${process.env.SSO_BASE_URL}/api/sso/refresh`;
            const response = await got.post(url, {
                headers: {Authorization: `Bearer ${token}`}
            });

            if (response.statusCode === 200) {
                // 从 SSO 响应头中获取 set-cookie
                const setCookieHeader = response.headers['set-cookie'];
                ctx.set('Set-Cookie', setCookieHeader);
            }
        } catch (err) {
            this.handleError(err);
        }
    }

    static handleError(err) {
        if (err.response?.body) {
            const {code, msg} = JSON.parse(err.response.body);
            if (code && msg) throw new HttpException(msg, code);
        }
        throw err;
    }
}

module.exports = AuthService;
