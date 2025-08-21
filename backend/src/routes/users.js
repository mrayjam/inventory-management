import express from 'express';
import { createUser, getAdmins, resetUserPassword } from '../controllers/userController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';
import { validateCreateUser, validateResetPassword } from '../middleware/validation.js';

const router = express.Router();

// POST /api/users
router.post('/', authenticate, requireSuperAdmin, validateCreateUser, createUser);

// GET /api/users/admins
router.get('/admins', authenticate, requireSuperAdmin, getAdmins);

// POST /api/users/:userId/reset-password
router.post('/:userId/reset-password', authenticate, requireSuperAdmin, validateResetPassword, resetUserPassword);

export default router;