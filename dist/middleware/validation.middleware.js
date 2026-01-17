"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
// VALIDATION MIDDLEWARE
// This middleware validates request data using Zod schemas
// If validation fails, it throws a ValidationError
// Otherwise, it calls the next middleware
// AnyZodObject - accepts any Zod schema object 
// ZodError - accepts any Zod error object
// validate - accepts any Zod schema object
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                console.log('Validation error:', errors);
                next(new errors_1.ValidationError('Validation failed', errors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map