const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const AnimeBannerCreateValidator = parameter => {
    const schema = Zod.object({
        animeId: Zod.string({
            required_error: 'animeId 不能为空',
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .min(1, 'animeId 不能为空')
    });
    return validate(schema, parameter);
};

const AnimeBannerListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name', 'description'], {
            message: 'type 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeBannerCreateValidator,
    AnimeBannerListValidator,
    AnimeBannerDeleteValidator: commonIdValidator
};
