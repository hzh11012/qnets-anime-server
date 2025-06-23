const Zod = require('zod');
const {
    commonId,
    commonList,
    validate,
    commonIdValidator
} = require('@validators/server/common');

const IMAGE_REG = /^(https?:)?\/\/.*\.(jpe?g|png|webp|avif)$/;

const AnimeCreateValidator = parameter => {
    const schema = Zod.object({
        series: Zod.string({
            required_error: 'series 不能为空',
            invalid_type_error: 'series 类型错误'
        })
            .max(255, 'series 长度不能超过255')
            .min(1, 'series 不能为空'),
        name: Zod.string({
            required_error: 'name 不能为空',
            invalid_type_error: 'name 类型错误'
        })
            .max(25, {
                message: 'name 长度不能超过25'
            })
            .min(1, 'name 不能为空'),
        description: Zod.string({
            required_error: 'description 不能为空',
            invalid_type_error: 'description 类型错误'
        })
            .max(1000, {
                message: 'description 长度不能超过1000'
            })
            .min(1, 'description 不能为空'),
        coverUrl: Zod.string({
            required_error: 'coverUrl 不能为空',
            invalid_type_error: 'coverUrl 类型错误'
        })
            .max(255, {
                message: 'coverUrl 长度不能超过255'
            })
            .min(1, 'coverUrl 不能为空')
            .regex(IMAGE_REG, {
                message: 'coverUrl 格式错误'
            }),
        bannerUrl: Zod.string({
            required_error: 'bannerUrl 不能为空',
            invalid_type_error: 'bannerUrl 类型错误'
        })
            .max(255, {
                message: 'bannerUrl 长度不能超过255'
            })
            .min(1, 'bannerUrl 不能为空')
            .regex(IMAGE_REG, {
                message: 'bannerUrl 格式错误'
            }),
        status: Zod.enum(['0', '1', '2'], {
            message: 'status 参数错误'
        }).transform(val => parseInt(val, 10)),
        type: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'status 参数错误'
        }).transform(val => parseInt(val, 10)),
        director: Zod.string({
            invalid_type_error: 'director 类型错误'
        })
            .max(25, {
                message: 'director 长度不能超过25'
            })
            .optional(),
        cv: Zod.string({
            invalid_type_error: 'cv 类型错误'
        })
            .max(255, {
                message: 'cv 长度不能超过255'
            })
            .optional(),
        year: Zod.enum(
            Array.from({length: new Date().getFullYear() - 1988}, (_, i) =>
                String(1990 + i)
            ),
            {
                message: 'year 参数错误'
            }
        ).transform(val => parseInt(val, 10)),
        month: Zod.enum(['0', '1', '2', '3'], {
            message: 'month 参数错误'
        }).transform(val => parseInt(val, 10)),
        season: Zod.enum(
            Array.from({length: 999}, (_, i) => String(0 + i)),
            {
                message: 'season 参数错误'
            }
        ).transform(val => parseInt(val, 10)),
        seasonName: Zod.string({
            invalid_type_error: 'seasonName 类型错误'
        })
            .max(10, {
                message: 'seasonName 长度不能超过10'
            })
            .optional(),
        tags: Zod.string({
            invalid_type_error: 'tags 参数错误'
        })
            .max(255, {
                message: 'tags 参数错误'
            })
            .array()
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeListValidator = parameter => {
    const schema = Zod.object({
        ...commonList,
        type: Zod.enum(
            ['name', 'description', 'director', 'cv', 'seasonName'],
            {
                message: 'type 参数错误'
            }
        ).optional(),
        types: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'types 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        status: Zod.enum(['0', '1', '2'], {
            message: 'status 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        months: Zod.enum(['0', '1', '2', '3'], {
            message: 'months 参数错误'
        })
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        years: Zod.enum(
            Array.from({length: new Date().getFullYear() - 1988}, (_, i) =>
                String(1990 + i)
            ),
            {
                message: 'year 参数错误'
            }
        )
            .array()
            .transform(arr => arr.map(val => parseInt(val, 10)))
            .optional(),
        tags: Zod.string({
            invalid_type_error: 'tags 参数错误'
        })
            .max(255, {
                message: 'tags 参数错误'
            })
            .array()
            .optional()
    });
    return validate(schema, parameter);
};

const AnimeEditValidator = parameter => {
    const editSchema = {
        name: Zod.string({
            invalid_type_error: 'name 类型错误'
        })
            .max(25, {
                message: 'name 长度不能超过25'
            })
            .optional(),
        series: Zod.string({
            invalid_type_error: 'series 类型错误'
        })
            .max(255, 'series 长度不能超过255')
            .optional(),
        description: Zod.string({
            invalid_type_error: 'description 类型错误'
        })
            .max(1000, {
                message: 'description 长度不能超过1000'
            })
            .optional(),
        coverUrl: Zod.string({
            invalid_type_error: 'coverUrl 类型错误'
        })
            .max(255, {
                message: 'coverUrl 长度不能超过255'
            })
            .regex(IMAGE_REG, {
                message: 'coverUrl 格式不正确'
            })
            .optional(),
        bannerUrl: Zod.string({
            invalid_type_error: 'bannerUrl 类型错误'
        })
            .max(255, {
                message: 'bannerUrl 长度不能超过255'
            })
            .regex(IMAGE_REG, {
                message: 'bannerUrl 格式不正确'
            })
            .optional(),
        status: Zod.enum(['0', '1', '2'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        type: Zod.enum(['0', '1', '2', '3', '4'], {
            message: 'status 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        director: Zod.string({
            invalid_type_error: 'director 类型错误'
        })
            .max(25, {
                message: 'director 长度不能超过25'
            })
            .optional(),
        cv: Zod.string({
            invalid_type_error: 'cv 类型错误'
        })
            .max(255, {
                message: 'cv 长度不能超过255'
            })
            .optional(),
        year: Zod.enum(
            Array.from({length: new Date().getFullYear() - 1988}, (_, i) =>
                String(1990 + i)
            ),
            {
                message: 'year 参数错误'
            }
        )
            .transform(val => parseInt(val, 10))
            .optional(),
        month: Zod.enum(['0', '1', '2', '3'], {
            message: 'month 参数错误'
        })
            .transform(val => parseInt(val, 10))
            .optional(),
        season: Zod.enum(
            Array.from({length: 999}, (_, i) => String(0 + i)),
            {
                message: 'season 参数错误'
            }
        )
            .transform(val => parseInt(val, 10))
            .optional(),
        seasonName: Zod.string({
            invalid_type_error: 'seasonName 类型错误'
        })
            .max(10, {
                message: 'seasonName 长度不能超过10'
            })
            .optional(),
        tags: Zod.string({
            invalid_type_error: 'tags 参数错误'
        })
            .max(255, {
                message: 'tags 参数错误'
            })
            .array()
            .optional()
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
    AnimeCreateValidator,
    AnimeListValidator,
    AnimeEditValidator,
    AnimeDeleteValidator: commonIdValidator
};
