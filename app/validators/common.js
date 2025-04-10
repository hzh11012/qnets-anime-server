const {ParameterException} = require('@core/http-exception');

const validate = (schema, parameter) => {
    const result = schema.safeParse(parameter);

    if (!result.success) {
        throw new ParameterException(result.error.issues[0].message);
    }
    return result.data;
};

module.exports = {
    validate
};