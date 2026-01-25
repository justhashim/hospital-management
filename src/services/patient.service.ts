import { prisma } from '../config/database';
import { CreatePatientInput, UpdatePatientInput, PatientQueryInput } from '../utils/validation';
import { NotFoundError } from '../utils/errors';
import type { Patient } from '@prisma/client';

/**
 * Patient Service
 * 
 * Handles all patient-related business logic including:
 * - Creating new patient records
 * - Retrieving patient information
 * - Updating patient records
 * - Deleting patient records
 * - Searching and filtering patients
 */

interface PaginatedPatients {
    patients: Patient[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Create a new patient
 */
export const createPatient = async (
    data: CreatePatientInput,
    createdById: string
): Promise<Patient> => {
    const patient = await prisma.patient.create({
        data: {
            ...data,
            dateOfBirth: new Date(data.dateOfBirth),
            createdById,
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    return patient;
};

/**
 * Get patient by ID
 */
export const getPatientById = async (id: string): Promise<Patient> => {
    const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            updatedBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    if (!patient) {
        throw new NotFoundError('Patient not found');
    }

    return patient;
};

/**
 * Get all patients with pagination and filtering
 */
export const getAllPatients = async (
    query: PatientQueryInput
): Promise<PaginatedPatients> => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {
        isActive: true,
    };

    if (query.search) {
        where.OR = [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { phone: { contains: query.search, mode: 'insensitive' } },
        ];
    }

    if (query.gender) {
        where.gender = query.gender;
    }

    if (query.bloodGroup) {
        where.bloodGroup = query.bloodGroup;
    }

    // Get total count for pagination
    const total = await prisma.patient.count({ where });

    // Get patients
    const patients = await prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    return {
        patients,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Update patient by ID
 */
export const updatePatient = async (
    id: string,
    data: UpdatePatientInput,
    updatedById: string
): Promise<Patient> => {
    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
        where: { id },
    });

    if (!existingPatient) {
        throw new NotFoundError('Patient not found');
    }

    // Update patient
    const updateData: any = {
        ...data,
        updatedById,
    };

    if (data.dateOfBirth) {
        updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    const patient = await prisma.patient.update({
        where: { id },
        data: updateData,
        include: {
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            updatedBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    return patient;
};

/**
 * Soft delete patient by ID
 */
export const deletePatient = async (id: string): Promise<void> => {
    const existingPatient = await prisma.patient.findUnique({
        where: { id },
    });

    if (!existingPatient) {
        throw new NotFoundError('Patient not found');
    }

    // Soft delete (set isActive to false)
    await prisma.patient.update({
        where: { id },
        data: { isActive: false },
    });
};

/**
 * Permanently delete patient by ID (admin only)
 */
export const hardDeletePatient = async (id: string): Promise<void> => {
    const existingPatient = await prisma.patient.findUnique({
        where: { id },
    });

    if (!existingPatient) {
        throw new NotFoundError('Patient not found');
    }

    await prisma.patient.delete({
        where: { id },
    });
};

/**
 * Search patients by name, email, or phone
 */
export const searchPatients = async (searchTerm: string): Promise<Patient[]> => {
    const patients = await prisma.patient.findMany({
        where: {
            isActive: true,
            OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { phone: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 20,
        orderBy: {
            lastName: 'asc',
        },
    });

    return patients;
};
