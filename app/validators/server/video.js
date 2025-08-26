const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const VIDEO_REG = /^(https?:)?\/\/.*\/index\.m3u8$/;

const VideoCreateValidator = parameter => {
    const schema = Zod.object({
        animeId: Zod.string({
            required_error: 'animeId 不能为空',
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .min(1, 'animeId 不能为空'),
        title: Zod.string({
            invalid_type_error: 'title 类型错误'
        })
            .max(50, {
                message: 'title 长度不能超过50'
            })
            .optional(),
        url: Zod.string({
            required_error: 'url 不能为空',
            invalid_type_error: 'url 类型错误'
        })
            .max(255, {
                message: 'url 长度不能超过255'
            })
            .min(1, 'url 不能为空')
            .regex(VIDEO_REG, {
                message: 'url 格式错误'
            }),
        episode: Zod.number({
            required_error: 'episode 不能为空',
            invalid_type_error: 'episode 类型错误'
        })
            .int('episode 必须为整数')
            .max(65535, 'episode 最大为65535')
            .min(0, 'episode 最小为0')
    });
    return validate(schema, parameter);
};

const VideoListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name', 'url'], {
            message: 'type 参数错误'
        }).optional(),
        orderBy: Zod.enum(['createdAt', 'updatedAt', 'episode'], {
            message: 'orderBy 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

const VideoEditValidator = parameter => {
    const editSchema = {
        animeId: Zod.string({
            invalid_type_error: 'animeId 类型错误'
        })
            .max(255, 'animeId 长度不能超过255')
            .optional(),
        title: Zod.string({
            invalid_type_error: 'title 类型错误'
        })
            .max(50, {
                message: 'title 长度不能超过50'
            })
            .optional(),
        url: Zod.string({
            invalid_type_error: 'url 类型错误'
        })
            .max(255, {
                message: 'url 长度不能超过255'
            })
            .regex(VIDEO_REG, {
                message: 'url 格式不正确'
            })
            .optional(),
        episode: Zod.number({
            invalid_type_error: 'episode 类型错误'
        })
            .int('episode 必须为整数')
            .max(65535, 'episode 最大为65535')
            .min(0, 'episode 最小为0')
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
    VideoCreateValidator,
    VideoListValidator,
    VideoEditValidator,
    VideoDeleteValidator: commonIdValidator
};
