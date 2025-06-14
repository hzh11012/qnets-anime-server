const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const DanmakuListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['nickname', 'text', 'animeName'], {
            message: 'type 参数错误'
        }).optional(),
        orderBy: Zod.enum(['createdAt', 'updatedAt', 'time'], {
            message: 'orderBy 参数错误'
        }).optional(),
        modes: Zod.enum(['0', '1', '2'], {
            message: 'modes 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    DanmakuListValidator,
    DanmakuDeleteValidator: commonIdValidator
};
