import { Request, Response, NextFunction } from 'express';
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUserById,
} from '../services/auth.service';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} from '../utils/validation';
import { AuthRequest, SuccessResponse } from '../types';
import { ValidationError } from '../utils/errors';

/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints and
 * delegates business logic to the authentication service.
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate request body
        const validatedData = registerSchema.parse(req.body);

        // Register user
        const result = await registerUser(validatedData);

        const response: SuccessResponse = {
            success: true,
            message: 'User registered successfully',
            data: result,
        };

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);

        // Login user
        const result = await loginUser(validatedData);

        const response: SuccessResponse = {
            success: true,
            message: 'Login successful',
            data: result,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate request body
        const validatedData = refreshTokenSchema.parse(req.body);

        // Refresh access token
        const tokens = await refreshAccessToken(validatedData.refreshToken);

        const response: SuccessResponse = {
            success: true,
            message: 'Token refreshed successfully',
            data: tokens,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate request body
        const validatedData = refreshTokenSchema.parse(req.body);

        // Logout user
        await logoutUser(validatedData.refreshToken);

        const response: SuccessResponse = {
            success: true,
            message: 'Logout successful',
            data: null,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            throw new ValidationError('User not authenticated');
        }

        // Get user by ID
        const user = await getUserById(authReq.user.userId);

        const response: SuccessResponse = {
            success: true,
            data: user,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
