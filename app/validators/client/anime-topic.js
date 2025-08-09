const Zod = require('zod');
const {validate, commonId, commonIdValidator} = require('@validators/common');

const AnimeTopicListValidator = parameter => {
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

const AnimeTopicDetailListValidator = parameter => {
    const schema = Zod.object({
        ...commonId,
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
    AnimeTopicListValidator,
    AnimeTopicDetailValidator: commonIdValidator,
    AnimeTopicDetailListValidator
};
