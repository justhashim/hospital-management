import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Validation Middleware
 * 
 * Validates request body, query parameters, or route parameters
 * against Zod schemas before processing the request.
 */

type ValidationType = 'body' | 'query' | 'params';

/**
 * Generic validation middleware factory
 * @param schema - Zod schema to validate against
 * @param type - Part of request to validate (body, query, or params)
 */
export const validate = (schema: AnyZodObject, type: ValidationType = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req[type];
            const validated = await schema.parseAsync(data);
            req[type] = validated;
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Validate request body
 */
export const validateBody = (schema: AnyZodObject) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: AnyZodObject) => validate(schema, 'query');

/**
 * Validate route parameters
 */
export const validateParams = (schema: AnyZodObject) => validate(schema, 'params');
