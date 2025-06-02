const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const AnimeRecommendCreateValidator = parameter => {
    const schema = Zod.object({
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(50, {
                message: 'name 长度不能超过50'
            })
            .min(1, 'name 不能为空'),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        }).transform(val => parseInt(val, 10)),
        animes: Zod.string({
            invalid_type_error: 'animes 参数错误'
        })
            .max(255, {
                message: 'animes 参数错误'
            })
            .array()
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeRecommendListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name'], {
            message: 'type 参数错误'
        }).optional(),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeRecommendEditValidator = parameter => {
    const editSchema = {
        name: Zod.string({
            invalid_type_error: 'name 类型错误'
        })
            .max(50, {
                message: 'name 长度不能超过50'
            })
            .optional(),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        animes: Zod.string({
            invalid_type_error: 'animes 参数错误'
        })
            .max(255, {
                message: 'animes 参数错误'
            })
            .array()
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
    AnimeRecommendCreateValidator,
    AnimeRecommendListValidator,
    AnimeRecommendEditValidator,
    AnimeRecommendDeleteValidator: commonIdValidator
};
