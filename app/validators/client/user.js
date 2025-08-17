const Zod = require('zod');
const {validate} = require('@validators/common');

const UserEditValidator = parameter => {
    const editSchema = {
        nickname: Zod.string({
            invalid_type_error: 'nickname 类型错误'
        })
            .max(25, {
                message: 'nickname 长度不能超过25'
            })
            .optional()
    };

    const editKeys = Object.keys(editSchema);

    const schema = Zod.object({
        ...editSchema
    }).refine(
        obj => editKeys.some(key => obj[key] !== undefined),
        '缺少有效参数'
    );
    return validate(schema, parameter);
};

module.exports = {
    UserEditValidator
};
