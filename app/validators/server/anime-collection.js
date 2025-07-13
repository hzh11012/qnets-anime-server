const Zod = require('zod');
const {
    commonList,
    validate,
    commonIdValidator
} = require('@validators/common');

const AnimeCollectionListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(['nickname', 'animeName'], {
            message: 'type 参数错误'
        }).optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeCollectionListValidator,
    AnimeCollectionDeleteValidator: commonIdValidator
};
