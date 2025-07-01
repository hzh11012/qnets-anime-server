const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const VideoHistoryListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['nickname', 'animeName'], {
            message: 'type 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    VideoHistoryListValidator,
    VideoHistoryDeleteValidator: commonIdValidator
};
