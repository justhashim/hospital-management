import rateLimit from 'express-rate-limit';
import config from '../config';

/**
 * Rate Limiting Middleware
 * 
 * Protects the API from abuse by limiting the number of requests
 * from a single IP address within a time window.
 */

/**
 * General rate limiter for all routes
 */
export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs, // 15 minutes by default
    max: config.rateLimit.maxRequests, // 100 requests per window by default
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Skip rate limiting for successful requests in development
    skip: (req) => {
        return config.nodeEnv === 'development' && req.ip === '::1';
    },
});

/**
 * Stricter rate limiter for authentication routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Very strict rate limiter for registration
 */
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 registrations per hour
    message: {
        success: false,
        message: 'Too many accounts created from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
