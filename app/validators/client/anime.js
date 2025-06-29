const Zod = require('zod');
const {validate} = require('@validators/server/common');

const AnimeOptionValidator = parameter => {
    const schema = Zod.object({
        type: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'type 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional()
    });
    return validate(schema, parameter);
};

module.exports = {
    AnimeOptionValidator
};
