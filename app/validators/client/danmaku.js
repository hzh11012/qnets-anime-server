const Zod = require('zod');
const {commonId, validate, commonIdValidator} = require('@validators/common');

const COLOR_REG = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/i;

const DanmakuCreateValidator = parameter => {
    const schema = Zod.object({
        ...commonId,
        text: Zod.string({
            required_error: 'text 不能为空',
            invalid_type_error: 'text 类型错误'
        })
            .max(50, {
                message: 'text 长度不能超过50'
            })
            .min(1, 'text 不能为空'),
        mode: Zod.number({
            required_error: 'mode 不能为空',
            invalid_type_error: 'mode 类型错误'
        })
            .int('mode 必须为整数')
            .max(2, 'mode 最大为2')
            .min(0, 'mode 最小为0'),
        color: Zod.string({
            required_error: 'color 不能为空',
            invalid_type_error: 'color 类型错误'
        })
            .max(7, {
                message: 'color 长度不能超过7'
            })
            .min(1, 'color 不能为空')
            .regex(COLOR_REG, {
                message: 'color 格式错误'
            }),
        time: Zod.number({
            required_error: 'time 不能为空',
            invalid_type_error: 'time 类型错误'
        })
    });
    return validate(schema, parameter);
};

module.exports = {
    DanmakuCreateValidator,
    DanmakuListValidator: commonIdValidator
};
