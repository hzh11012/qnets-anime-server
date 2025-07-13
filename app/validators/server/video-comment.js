const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const VideoCommentListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['content', 'nickname', 'animeName'], {
            message: 'type 参数错误'
        }).optional(),
        orderBy: Zod.enum(
            ['createdAt', 'updatedAt', 'likeCount', 'replyCount'],
            {
                message: 'orderBy 参数错误'
            }
        ).optional()
    });
    return validate(schema, parameter);
};

const VideoCommentEditValidator = parameter => {
    const editSchema = {
        content: Zod.string({
            invalid_type_error: 'content 类型错误'
        })
            .max(2500, {
                message: 'content 长度不能超过2500'
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
    VideoCommentListValidator,
    VideoCommentEditValidator,
    VideoCommentDeleteValidator: commonIdValidator
};
