import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';


// VALIDATION MIDDLEWARE
// This middleware validates request data using Zod schemas
// If validation fails, it throws a ValidationError
// Otherwise, it calls the next middleware
// AnyZodObject - accepts any Zod schema object 
// ZodError - accepts any Zod error object
// validate - accepts any Zod schema object

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        console.log('Validation error:', errors);
        next(new ValidationError('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};