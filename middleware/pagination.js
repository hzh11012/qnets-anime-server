const pagination = (ctx, next) => {
    const hasPage = 'page' in ctx.query;
    const hasPageSize = 'pageSize' in ctx.query;

    if (hasPage) ctx.query.page = parseInt(ctx.query.page, 10);
    if (hasPageSize) ctx.query.pageSize = parseInt(ctx.query.pageSize, 10);

    return next();
};

module.exports = pagination;
