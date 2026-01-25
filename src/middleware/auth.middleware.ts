import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { AuthRequest, UserRole } from '../types';

/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT access tokens and attaching
 * user information to the request object.
 */

/**
 * Verify JWT access token and attach user to request
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        (req as AuthRequest).user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Role-based access control middleware
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authReq = req as AuthRequest;

            if (!authReq.user) {
                throw new UnauthorizedError('Authentication required');
            }

            if (!allowedRoles.includes(authReq.user.role as UserRole)) {
                throw new ForbiddenError(
                    `Access denied. Required roles: ${allowedRoles.join(', ')}`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if token is missing
 */
export const optionalAuthenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);

            (req as AuthRequest).user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
        }

        next();
    } catch (error) {
        // Don't fail if token is invalid, just continue without user
        next();
    }
};
