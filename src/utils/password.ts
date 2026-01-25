import bcrypt from 'bcrypt';
import config from '../config';

/**
 * Password Utility Functions
 * 
 * Secure password hashing and comparison using bcrypt.
 * Uses configurable salt rounds for production-grade security.
 */

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Failed to hash password');
    }
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Failed to compare passwords');
    }
};

/**
 * Validate password strength
 * @param password - Plain text password
 * @returns True if password meets requirements
 */
export const isPasswordStrong = (password: string): boolean => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
