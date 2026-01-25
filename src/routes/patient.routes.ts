import { Router } from 'express';
import {
    create,
    getById,
    getAll,
    update,
    remove,
    permanentDelete,
    search,
} from '../controllers/patient.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

/**
 * Patient Routes
 * 
 * Defines all patient management endpoints with role-based access control:
 * - POST /patients - Create new patient (authenticated users)
 * - GET /patients - Get all patients with pagination (authenticated users)
 * - GET /patients/search - Search patients (authenticated users)
 * - GET /patients/:id - Get patient by ID (authenticated users)
 * - PUT /patients/:id - Update patient (authenticated users)
 * - DELETE /patients/:id - Soft delete patient (authenticated users)
 * - DELETE /patients/:id/permanent - Permanently delete patient (admin only)
 */

const router: Router = Router();

// All routes require authentication
router.use(authenticate);

// Search patients (must be before /:id route)
router.get('/search', search);

// CRUD operations
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

// Admin-only routes
router.delete('/:id/permanent', authorize('ADMIN'), permanentDelete);

export default router;
