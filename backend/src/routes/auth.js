import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin, validateChangePassword } from '../middleware/validation.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

// POST /api/auth/change-password
router.post('/change-password', authenticate, validateChangePassword, changePassword);

export default router;