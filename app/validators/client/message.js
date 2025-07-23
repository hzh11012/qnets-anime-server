const Zod = require('zod');
const {validate} = require('@validators/common');

const MessageCreateValidator = parameter => {
    const schema = Zod.object({
        type: Zod.enum(['0', '1', '2', '3'], {
            message: 'type 参数错误'
        }).transform(val => parseInt(val, 10)),
        content: Zod.string({
            required_error: 'content 不能为空',
            invalid_type_error: 'content 类型错误'
        })
            .max(1000, {
                message: 'content 长度不能超过1000'
            })
            .min(1, 'content 不能为空')
    });
    return validate(schema, parameter);
};

module.exports = {
    MessageCreateValidator
};
