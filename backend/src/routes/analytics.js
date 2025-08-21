import express from 'express';
import { getRevenue, getTopSellingProducts } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/revenue', authenticate, getRevenue);

router.get('/top-selling', authenticate, getTopSellingProducts);

export default router;