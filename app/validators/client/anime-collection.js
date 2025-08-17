const Zod = require('zod');
const {validate, commonIdValidator} = require('@validators/common');

const AnimeCollectionDeleteValidator = parameter => {
    const schema = Zod.object({
        animeId: Zod.string({
            required_error: 'id 不能为空',
            invalid_type_error: 'id 类型错误'
        })
            .max(255, 'id 长度不能超过255')
            .min(1, 'id 不能为空')
    });
    return validate(schema, parameter);
};

const AnimeCollectionListValidator = parameter => {
    const schema = Zod.object({
        page: Zod.number({
            invalid_type_error: 'page 类型错误'
        })
            .int('page 必须为整数')
            .min(1, 'page 最小为1')
            .optional(),
        pageSize: Zod.number({
            invalid_type_error: 'pageSize 类型错误'
        })
            .int('pageSize 必须为整数')
            .min(1, 'pageSize 最小为1')
            .optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeCollectionCreateValidator: commonIdValidator,
    AnimeCollectionDeleteValidator,
    AnimeCollectionListValidator
};
