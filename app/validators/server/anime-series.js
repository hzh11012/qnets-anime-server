const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const AnimeSeriesCreateValidator = parameter => {
    const schema = Zod.object({
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(50, {
                message: 'name 长度不能超过50'
            })
            .min(1, 'name 不能为空')
    });
    return validate(schema, parameter);
};

const AnimeSeriesListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name'], {
            message: 'type 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeSeriesCreateValidator,
    AnimeSeriesListValidator,
    AnimeSeriesDeleteValidator: commonIdValidator
};
