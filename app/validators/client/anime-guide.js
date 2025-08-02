const Zod = require('zod');
const {validate} = require('@validators/common');

const AnimeGuideListValidator = parameter => {
    const schema = Zod.object({
        updateDay: Zod.enum(['0', '1', '2', '3', '4', '5', '6'], {
            message: 'updateDay 参数错误'
        }).transform(val => parseInt(val, 10)),
        page: Zod.number({
            invalid_type_error: 'page 类型错误'
        })
            .int('page 必须为整数')
            .min(1, 'page 最小为1')
            .optional(),
        pageSize: Zod.number({
            invalid_type_error: 'pageSize 类型错误'
        })
            .int('pageSize 必须为整数')
            .min(1, 'pageSize 最小为1')
            .optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeGuideListValidator
};
