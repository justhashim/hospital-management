import { Request } from 'express';
import { User } from '@prisma/client';

/**
 * Custom Type Definitions
 * 
 * Extended Express types and shared interfaces for type safety
 * across the application.
 */

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

// API Response Types
export interface SuccessResponse<T = any> {
    success: true;
    message?: string;
    data: T;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
    stack?: string;
}

export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// User types (omit sensitive fields)
export type PublicUser = Omit<User, 'password'>;

export type UserRole = 'ADMIN' | 'USER' | 'DOCTOR';
