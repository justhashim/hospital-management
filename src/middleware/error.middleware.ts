import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { AppError, ValidationError } from '../utils/errors';
import { ErrorResponse } from '../types';
import config from '../config';

/**
 * Error Handler Middleware
 * 
 * Centralized error handling that catches all errors and sends
 * appropriate HTTP responses with consistent structure.
 */

/**
 * Handle Zod validation errors
 */
const handleZodError = (error: ZodError): ValidationError => {
    const errors = error.issues.map((err: ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
    }));

    const message = errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ');
};

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error: any): AppError => {
    // Unique constraint violation
    if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        return new ValidationError(`${field} already exists`);
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
        return new ValidationError('Referenced record does not exist');
    }

    // Record not found
    if (error.code === 'P2025') {
        return new ValidationError('Record not found');
    }

    // Default Prisma error
    return new AppError('Database error occurred', 500);
};

/**
 * Global error handler middleware
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let appError: AppError;

    // Handle known error types
    if (error instanceof AppError) {
        appError = error;
    } else if (error instanceof ZodError) {
        appError = handleZodError(error);
    } else if (error.name === 'PrismaClientKnownRequestError') {
        appError = handlePrismaError(error);
    } else if (error.name === 'PrismaClientValidationError') {
        appError = new ValidationError('Invalid data provided');
    } else {
        // Unknown error
        appError = new AppError(
            config.nodeEnv === 'development' ? error.message : 'Internal server error',
            500,
            false
        );
    }

    // Log error in development
    if (config.nodeEnv === 'development') {
        console.error('Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode: appError.statusCode,
        });
    }

    // Send error response
    const errorResponse: ErrorResponse = {
        success: false,
        message: appError.message,
    };

    // Include stack trace in development
    if (config.nodeEnv === 'development' && error.stack) {
        errorResponse.stack = error.stack;
    }

    res.status(appError.statusCode).json(errorResponse);
};

/**
 * Handle 404 errors (route not found)
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
