const Zod = require('zod');
const {validate, commonIdValidator} = require('@validators/common');

const AnimeOptionValidator = parameter => {
    const schema = Zod.object({
        type: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'type 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeGuessLikeListValidator = parameter => {
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

const AnimeDetailValidator = parameter => {
    const schema = Zod.object({
        videoId: Zod.string({
            required_error: 'id 不能为空',
            invalid_type_error: 'id 类型错误'
        })
            .max(255, 'id 长度不能超过255')
            .min(1, 'id 不能为空')
    });
    return validate(schema, parameter);
};

const AnimeHotRankValidator = parameter => {
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

const AnimeSuggetsValidator = parameter => {
    const schema = Zod.object({
        keyword: Zod.string({
            required_error: 'keyword 不能为空',
            invalid_type_error: 'keyword 类型错误'
        })
            .max(255, 'keyword 长度不能超过255')
            .min(1, 'keyword 不能为空')
    });
    return validate(schema, parameter);
};

const AnimeBangumiValidator = parameter => {
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
            .optional(),
        order: Zod.enum(['0', '1', '2', '3'], {
            message: 'order 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        type: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'type 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        tag: Zod.string({
            invalid_type_error: 'tag 参数错误'
        })
            .max(25, {
                message: 'tag 参数错误'
            })
            .optional(),
        status: Zod.enum(['0', '1', '2'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        year: Zod.string({
            invalid_type_error: 'year 参数错误'
        })
            .max(11, {
                message: 'year 参数错误'
            })
            .optional(),
        month: Zod.enum(['0', '1', '2', '3'], {
            message: 'month 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeSearchValidator = parameter => {
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
            .optional(),
        keyword: Zod.string({
            required_error: 'keyword 不能为空',
            invalid_type_error: 'keyword 类型错误'
        })
            .max(255, 'keyword 长度不能超过255')
            .min(1, 'keyword 不能为空')
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeOptionValidator,
    AnimeGuessLikeListValidator,
    AnimeDetailValidator,
    AnimeHotRankValidator,
    AnimeRecommendValidator: commonIdValidator,
    AnimeSuggetsValidator,
    AnimeBangumiValidator,
    AnimeSearchValidator
};
