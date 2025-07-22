const Zod = require('zod');
const {validate, commonId} = require('@validators/common');

const AnimeRatingCreateValidator = parameter => {
    const schema = Zod.object({
        ...commonId,
        score: Zod.enum(['1', '2', '3', '4', '5'], {
            message: 'score 参数错误'
        }).transform(val => parseInt(val, 10)),
        content: Zod.string({
            invalid_type_error: 'content 类型错误'
        }).max(1000, 'content 长度不能超过1000')
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeRatingCreateValidator
};
