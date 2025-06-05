const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const AnimeRatingListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['userName', 'content', 'animeName'], {
            message: 'type 参数错误'
        }).optional(),
        orderBy: Zod.enum(['createdAt', 'updatedAt', 'score'], {
            message: 'orderBy 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

const AnimeRatingEditValidator = parameter => {
    const editSchema = {
        score: Zod.enum(['1', '2', '3', '4', '5'], {
            message: 'updateDay 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        content: Zod.string({
            invalid_type_error: 'content 类型错误'
        })
            .max(1000, 'content 长度不能超过1000')
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
    AnimeRatingListValidator,
    AnimeRatingEditValidator,
    AnimeRatingDeleteValidator: commonIdValidator
};
