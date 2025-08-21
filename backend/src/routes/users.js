import express from 'express';
import { createUser, getAdmins, resetUserPassword } from '../controllers/userController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';
import { validateCreateUser, validateResetPassword } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticate, requireSuperAdmin, validateCreateUser, createUser);

router.get('/admins', authenticate, requireSuperAdmin, getAdmins);

router.post('/:userId/reset-password', authenticate, requireSuperAdmin, validateResetPassword, resetUserPassword);

export default router;