const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const MessageListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['content', 'replay'], {
            message: 'type 参数错误'
        }).optional(),
        types: Zod.string({
            invalid_type_error: 'types 类型错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        status: Zod.string({
            invalid_type_error: 'status 类型错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional()
    });
    return validate(schema, parameter);
};

const MessageEditValidator = parameter => {
    const editSchema = {
        reply: Zod.string({
            invalid_type_error: 'reply 类型错误'
        })
            .max(1000, {
                message: 'reply 长度不能超过1000'
            })
            .optional(),
        type: Zod.enum(['0', '1', '2', '3'], {
            message: 'type 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        status: Zod.enum(['0', '1', '2', '3'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
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
    MessageListValidator,
    MessageEditValidator,
    MessageDeleteValidator: commonIdValidator
};
