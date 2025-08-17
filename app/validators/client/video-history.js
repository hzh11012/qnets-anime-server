const Zod = require('zod');
const {validate, commonId} = require('@validators/common');

const VideoHistoryCreatValidator = parameter => {
    const schema = Zod.object({
        ...commonId,
        animeId: Zod.string({
            required_error: 'animeId 不能为空',
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .min(1, 'animeId 不能为空'),
        time: Zod.number({
            required_error: 'time 不能为空',
            invalid_type_error: 'time 类型错误'
        }).min(0, 'time 最小为0')
    });
    return validate(schema, parameter);
};

const VideoHistoryListValidator = parameter => {
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
    VideoHistoryCreatValidator,
    VideoHistoryListValidator
};
