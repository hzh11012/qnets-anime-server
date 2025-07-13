const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const NoticeCreateValidator = parameter => {
    const schema = Zod.object({
        title: Zod.string({
            required_error: 'title 不能为空',
            invalid_type_error: 'title 类型错误'
        })
            .max(50, {
                message: 'title 长度不能超过50'
            })
            .min(1, 'title 不能为空'),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        content: Zod.string({
            required_error: 'content 不能为空',
            invalid_type_error: 'content 类型错误'
        })
            .max(2500, {
                message: 'content 长度不能超过2500'
            })
            .min(1, 'content 不能为空')
    });
    return validate(schema, parameter);
};

const NoticeListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['title', 'content'], {
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

const NoticeEditValidator = parameter => {
    const editSchema = {
        title: Zod.string({
            invalid_type_error: 'title 类型错误'
        })
            .max(50, {
                message: 'title 长度不能超过50'
            })
            .optional(),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
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
    NoticeCreateValidator,
    NoticeListValidator,
    NoticeEditValidator,
    NoticeDeleteValidator: commonIdValidator
};
