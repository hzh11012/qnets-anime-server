const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const IMAGE_REG = /^(https?:)?\/\/.*\.(jpe?g|png|webp|avif)$/;

const AnimeTopicCreateValidator = parameter => {
    const schema = Zod.object({
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(50, {
                message: 'name 长度不能超过50'
            })
            .min(1, 'name 不能为空'),
        description: Zod.string({
            required_error: 'description 不能为空',
            invalid_type_error: 'description 类型错误'
        })
            .max(1000, {
                message: 'description 长度不能超过1000'
            })
            .min(1, 'description 不能为空'),
        coverUrl: Zod.string({
            required_error: 'coverUrl 不能为空',
            invalid_type_error: 'coverUrl 类型错误'
        })
            .max(255, {
                message: 'coverUrl 长度不能超过255'
            })
            .min(1, 'coverUrl 不能为空')
            .regex(IMAGE_REG, {
                message: 'coverUrl 格式错误'
            }),
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

const AnimeTopicListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name', 'description'], {
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

const AnimeTopicEditValidator = parameter => {
    const editSchema = {
        name: Zod.string({
            invalid_type_error: 'name 类型错误'
        })
            .max(50, {
                message: 'name 长度不能超过50'
            })
            .optional(),
        description: Zod.string({
            invalid_type_error: 'description 类型错误'
        })
            .max(1000, {
                message: 'description 长度不能超过1000'
            })
            .optional(),
        coverUrl: Zod.string({
            invalid_type_error: 'coverUrl 类型错误'
        })
            .max(255, {
                message: 'coverUrl 长度不能超过255'
            })
            .regex(IMAGE_REG, {
                message: 'coverUrl 格式不正确'
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
    AnimeTopicCreateValidator,
    AnimeTopicListValidator,
    AnimeTopicEditValidator,
    AnimeTopicDeleteValidator: commonIdValidator
};
