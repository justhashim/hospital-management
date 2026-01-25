import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * JWT Utility Functions
 * 
 * Handles token generation, verification, and decoding for both
 * access and refresh tokens with proper type safety.
 */

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface DecodedToken extends TokenPayload {
    iat: number;
    exp: number;
}

/**
 * Generate JWT access token
 * Short-lived token for API authentication
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiresIn,
        issuer: 'hospital-management-api',
        audience: 'hospital-management-client',
    });
};

/**
 * Generate JWT refresh token
 * Long-lived token for obtaining new access tokens
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
        issuer: 'hospital-management-api',
        audience: 'hospital-management-client',
    });
};

/**
 * Verify and decode access token
 */
export const verifyAccessToken = (token: string): DecodedToken => {
    try {
        return jwt.verify(token, config.jwt.accessSecret, {
            issuer: 'hospital-management-api',
            audience: 'hospital-management-client',
        }) as DecodedToken;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Access token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid access token');
        }
        throw error;
    }
};

/**
 * Verify and decode refresh token
 */
export const verifyRefreshToken = (token: string): DecodedToken => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret, {
            issuer: 'hospital-management-api',
            audience: 'hospital-management-client',
        }) as DecodedToken;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwt.decode(token) as DecodedToken;
    } catch (error) {
        return null;
    }
};
