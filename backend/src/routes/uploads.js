import express from 'express';
import { upload, uploadFile } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/uploads/file
router.post('/file', authenticate, upload.single('file'), uploadFile);

export default router;