const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const RoleCreateValidator = parameter => {
    const schema = Zod.object({
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(10, {
                message: 'name 长度不能超过10'
            })
            .min(1, 'name 不能为空'),
        role: Zod.string({
            required_error: 'role 不能为空',
            invalid_type_error: 'role 类型错误'
        })
            .max(50, {
                message: 'role 长度不能超过50'
            })
            .min(1, 'role 不能为空'),
        permissions: Zod.array(
            Zod.string({
                invalid_type_error: 'permissions 类型错误'
            }),
            {
                invalid_type_error: 'permissions 类型错误'
            }
        ).optional()
    });
    return validate(schema, parameter);
};

const RoleListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['name', 'role'], {
            message: 'type 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

const RoleEditValidator = parameter => {
    const editSchema = {
        name: Zod.string({
            invalid_type_error: 'name 类型错误'
        })
            .max(10, {
                message: 'name 长度不能超过10'
            })
            .optional(),
        role: Zod.string({
            required_error: 'role 不能为空',
            invalid_type_error: 'role 类型错误'
        })
            .max(50, {
                message: 'role 长度不能超过50'
            })
            .optional(),
        permissions: Zod.array(
            Zod.string({
                invalid_type_error: 'permissions 类型错误'
            }),
            {
                invalid_type_error: 'permissions 类型错误'
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
    RoleCreateValidator,
    RoleListValidator,
    RoleEditValidator,
    RoleDeleteValidator: commonIdValidator
};
