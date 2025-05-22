const trim = obj => {
    if (typeof obj === 'string') {
        obj = obj.trim();
    }
    if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            obj[key] = trim(obj[key]);
        }
    }
    return obj;
};

const trimmer = (ctx, next) => {
    ctx.request.body = trim(ctx.request.body);
    ctx.request.query = trim(ctx.request.query);
    ctx.params = trim(ctx.params);

    return next();
};

module.exports = trimmer;
