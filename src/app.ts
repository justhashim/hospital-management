import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { checkDatabaseConnection } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import {
    securityHeaders,
    sanitizeRequest,
    removeSensitiveHeaders,
    addSecurityHeaders,
} from './middleware/security.middleware';
import { generalLimiter, authLimiter, registerLimiter } from './middleware/rateLimiter.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';

/**
 * Express Application Setup
 * 
 * Configures Express with all middleware, routes, and error handling.
 * Production-ready setup with security, logging, and best practices.
 */

const app: Application = express();

// ============================================
// Global Middleware
// ============================================

// Security headers (Helmet)
app.use(securityHeaders);

// Remove sensitive headers
app.use(removeSensitiveHeaders);

// Add custom security headers
app.use(addSecurityHeaders);

// CORS configuration
app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request sanitization
app.use(sanitizeRequest);

// HTTP request logger
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// General rate limiting
app.use(generalLimiter);

// ============================================
// Health Check Routes
// ============================================

app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Hospital Management API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/health', async (_req: Request, res: Response) => {
    const dbConnected = await checkDatabaseConnection();

    res.status(dbConnected ? 200 : 503).json({
        success: dbConnected,
        message: dbConnected ? 'Service is healthy' : 'Database connection failed',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbConnected ? 'connected' : 'disconnected',
    });
});

// ============================================
// API Routes
// ============================================

// Authentication routes with stricter rate limiting
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);

// Patient management routes
app.use('/api/patients', patientRoutes);

// ============================================
// Error Handling
// ============================================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Export App
// ============================================

export default app;
