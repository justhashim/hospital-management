import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

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
export const validate = (schema: ZodTypeAny, type: ValidationType = 'body') => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
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
export const validateBody = (schema: ZodTypeAny) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: ZodTypeAny) => validate(schema, 'query');

/**
 * Validate route parameters
 */
export const validateParams = (schema: ZodTypeAny) => validate(schema, 'params');
