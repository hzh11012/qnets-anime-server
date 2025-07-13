const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const AnimeGuideCreateValidator = parameter => {
    const schema = Zod.object({
        animeId: Zod.string({
            required_error: 'animeId 不能为空',
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .min(1, 'animeId 不能为空'),
        updateDay: Zod.enum(['0', '1', '2', '3', '4', '5', '6'], {
            message: 'updateDay 参数错误'
        }).transform(val => parseInt(val, 10)),
        updateTime: Zod.string({
            required_error: 'updateTime 不能为空',
            invalid_type_error: 'updateTime 类型错误'
        }).time({
            message: 'updateTime 格式错误'
        })
    });
    return validate(schema, parameter);
};

const AnimeGuideListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name'], {
            message: 'type 参数错误'
        }).optional(),
        orderBy: Zod.enum(['createdAt', 'updatedAt', 'updateTime'], {
            message: 'orderBy 参数错误'
        }).optional(),
        updateDays: Zod.enum(['0', '1', '2', '3', '4', '5', '6'], {
            message: 'updateDay 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        status: Zod.enum(['0', '1', '2'], {
            message: 'status 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        tags: Zod.string({
            invalid_type_error: 'tags 参数错误'
        })
            .max(255, {
                message: 'tags 参数错误'
            })
            .array()
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeGuideEditValidator = parameter => {
    const editSchema = {
        animeId: Zod.string({
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .optional(),
        updateDay: Zod.enum(['0', '1', '2', '3', '4', '5', '6'], {
            message: 'updateDay 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        updateTime: Zod.string({
            invalid_type_error: 'updateTime 类型错误'
        })
            .time({
                message: 'updateTime 格式错误'
            })
            .optional()
    };

    const editKeys = Object.keys(editSchema);

    const schema = Zod.object({
        ...commonId,
        ...editSchema
    }).refine(
        obj => editKeys.some(key => obj[key] !== undefined),
        '缺少有效参数'
    );
    return validate(schema, parameter);
};

module.exports = {
    AnimeGuideCreateValidator,
    AnimeGuideListValidator,
    AnimeGuideEditValidator,
    AnimeGuideDeleteValidator: commonIdValidator
};
