import { z } from 'zod';

/**
 * Validation Schemas using Zod
 * 
 * Type-safe validation schemas for request bodies and query parameters.
 * Provides automatic type inference and runtime validation.
 */

// Auth Validation Schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    role: z.enum(['ADMIN', 'USER', 'DOCTOR']).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Patient Validation Schemas
export const createPatientSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Invalid email address').optional().nullable(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 characters').max(10),
    bloodGroup: z
        .enum([
            'A_POSITIVE',
            'A_NEGATIVE',
            'B_POSITIVE',
            'B_NEGATIVE',
            'AB_POSITIVE',
            'AB_NEGATIVE',
            'O_POSITIVE',
            'O_NEGATIVE',
        ])
        .optional()
        .nullable(),
    allergies: z.string().optional().nullable(),
    medicalHistory: z.string().optional().nullable(),
    emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
    emergencyContactPhone: z.string().min(10, 'Emergency contact phone must be at least 10 digits'),
});

export const updatePatientSchema = createPatientSchema.partial();

export const patientQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    bloodGroup: z
        .enum([
            'A_POSITIVE',
            'A_NEGATIVE',
            'B_POSITIVE',
            'B_NEGATIVE',
            'AB_POSITIVE',
            'AB_NEGATIVE',
            'O_POSITIVE',
            'O_NEGATIVE',
        ])
        .optional(),
});

// Type inference from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type PatientQueryInput = z.infer<typeof patientQuerySchema>;
