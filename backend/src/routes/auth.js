import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin, validateChangePassword } from '../middleware/validation.js';

const router = express.Router();

router.post('/login', validateLogin, login);

router.post('/change-password', authenticate, validateChangePassword, changePassword);

export default router;