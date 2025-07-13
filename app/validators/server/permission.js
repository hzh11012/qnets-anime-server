const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const PermissionCreateValidator = parameter => {
    const schema = Zod.object({
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(20, {
                message: 'name 长度不能超过20'
            })
            .min(1, 'name 不能为空'),
        permission: Zod.string({
            required_error: 'permission 不能为空',
            invalid_type_error: 'permission 类型错误'
        })
            .max(50, {
                message: 'permission 长度不能超过50'
            })
            .min(1, 'permission 不能为空')
    });
    return validate(schema, parameter);
};

const PermissionListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name', 'permission'], {
            message: 'type 参数错误'
        }).optional(),
        systems: Zod.enum(['0', '1'], {
            message: 'systems 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    PermissionCreateValidator,
    PermissionListValidator,
    PermissionDeleteValidator: commonIdValidator
};
