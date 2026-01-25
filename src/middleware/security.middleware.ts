import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

/**
 * Security Middleware
 * 
 * Implements various security best practices including:
 * - Helmet for secure HTTP headers
 * - CORS configuration
 * - Request sanitization
 * - XSS protection
 */

/**
 * Configure Helmet for secure HTTP headers
 */
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

/**
 * Sanitize request data to prevent NoSQL injection
 * (While we're using PostgreSQL, this is still a good practice)
 */
export const sanitizeRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Remove any keys that start with $
    const sanitizeObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }

        const sanitized: any = {};
        for (const key in obj) {
            if (!key.startsWith('$')) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    };

    if (req.body) {
        req.body = sanitizeObject(req.body);
    }

    if (req.query) {
        req.query = sanitizeObject(req.query);
    }

    if (req.params) {
        req.params = sanitizeObject(req.params);
    }

    next();
};

/**
 * Remove sensitive headers from response
 */
export const removeSensitiveHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.removeHeader('X-Powered-By');
    next();
};

/**
 * Add security-related response headers
 */
export const addSecurityHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};
