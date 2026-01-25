import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { RegisterInput, LoginInput } from '../utils/validation';
import { PublicUser } from '../types';

/**
 * Authentication Service
 * 
 * Handles all authentication-related business logic including:
 * - User registration with password hashing
 * - User login with JWT token generation
 * - Token refresh mechanism
 * - Token revocation
 * - User logout
 */

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface AuthResponse {
    user: PublicUser;
    tokens: AuthTokens;
}

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role || 'USER',
        },
    });

    // Generate tokens
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
        },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

/**
 * Login user
 */
export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new UnauthorizedError('Account is inactive. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
        },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
    // Verify refresh token
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Check if refresh token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked) {
        throw new UnauthorizedError('Refresh token is invalid or has been revoked');
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
        throw new UnauthorizedError('Refresh token has expired');
    }

    // Check if user is active
    if (!storedToken.user.isActive) {
        throw new UnauthorizedError('Account is inactive');
    }

    // Generate new tokens
    const tokenPayload = {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Revoke old refresh token
    await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
    });

    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: storedToken.user.id,
            expiresAt,
        },
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

/**
 * Logout user (revoke refresh token)
 */
export const logoutUser = async (refreshToken: string): Promise<void> => {
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });

    if (!storedToken) {
        throw new NotFoundError('Refresh token not found');
    }

    // Revoke refresh token
    await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
    });
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<PublicUser> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * Clean up expired refresh tokens (should be run periodically)
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
    const result = await prisma.refreshToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    });

    return result.count;
};
