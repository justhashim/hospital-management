import { Router } from 'express';
import {
    register,
    login,
    refresh,
    logout,
    getCurrentUser,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Authentication Routes
 * 
 * Defines all authentication-related endpoints:
 * - POST /register - Register new user
 * - POST /login - Login user
 * - POST /refresh - Refresh access token
 * - POST /logout - Logout user
 * - GET /me - Get current user profile
 */

const router: Router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
