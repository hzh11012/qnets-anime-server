const Zod = require('zod');
const {commonId, commonList, validate} = require('@validators/common');

const UserListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['email', 'nickname'], {
            message: 'type 参数错误'
        }).optional(),
        status: Zod.string({
            invalid_type_error: 'status 类型错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional()
    });
    return validate(schema, parameter);
};

const UserEditValidator = parameter => {
    const editSchema = {
        nickname: Zod.string({
            invalid_type_error: 'nickname 类型错误'
        })
            .max(25, {
                message: 'nickname 长度不能超过25'
            })
            .optional(),
        avatar: Zod.string({
            invalid_type_error: 'avatar 类型错误'
        })
            .max(255, {
                message: 'avatar 长度不能超过255'
            })
            .optional(),
        status: Zod.enum(['0', '1'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        roles: Zod.array(
            Zod.string({
                invalid_type_error: 'roles 类型错误'
            }),
            {
                invalid_type_error: 'roles 类型错误'
            }
        ).optional()
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
    UserListValidator,
    UserEditValidator
};
