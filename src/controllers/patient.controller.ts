import { Request, Response, NextFunction } from 'express';
import {
    createPatient,
    getPatientById,
    getAllPatients,
    updatePatient,
    deletePatient,
    hardDeletePatient,
    searchPatients,
} from '../services/patient.service';
import {
    createPatientSchema,
    updatePatientSchema,
    patientQuerySchema,
} from '../utils/validation';
import { AuthRequest, SuccessResponse, PaginatedResponse } from '../types';
import { ValidationError } from '../utils/errors';

/**
 * Patient Controller
 * 
 * Handles HTTP requests for patient management endpoints and
 * delegates business logic to the patient service.
 */

/**
 * Create a new patient
 * POST /api/patients
 */
export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            throw new ValidationError('User not authenticated');
        }

        // Validate request body
        const validatedData = createPatientSchema.parse(req.body);

        // Create patient
        const patient = await createPatient(validatedData, authReq.user.userId);

        const response: SuccessResponse = {
            success: true,
            message: 'Patient created successfully',
            data: patient,
        };

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const patient = await getPatientById(id);

        const response: SuccessResponse = {
            success: true,
            data: patient,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all patients with pagination and filtering
 * GET /api/patients
 */
export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate query parameters
        const validatedQuery = patientQuerySchema.parse(req.query);

        const result = await getAllPatients(validatedQuery);

        const response: PaginatedResponse<typeof result.patients[0]> = {
            success: true,
            data: result.patients,
            pagination: result.pagination,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Update patient by ID
 * PUT /api/patients/:id
 */
export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            throw new ValidationError('User not authenticated');
        }

        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Validate request body
        const validatedData = updatePatientSchema.parse(req.body);

        // Update patient
        const patient = await updatePatient(id, validatedData, authReq.user.userId);

        const response: SuccessResponse = {
            success: true,
            message: 'Patient updated successfully',
            data: patient,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete patient by ID (soft delete)
 * DELETE /api/patients/:id
 */
export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        await deletePatient(id);

        const response: SuccessResponse = {
            success: true,
            message: 'Patient deleted successfully',
            data: null,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Permanently delete patient by ID (admin only)
 * DELETE /api/patients/:id/permanent
 */
export const permanentDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        await hardDeletePatient(id);

        const response: SuccessResponse = {
            success: true,
            message: 'Patient permanently deleted',
            data: null,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Search patients
 * GET /api/patients/search
 */
export const search = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            throw new ValidationError('Search query parameter "q" is required');
        }

        const patients = await searchPatients(q);

        const response: SuccessResponse = {
            success: true,
            data: patients,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
