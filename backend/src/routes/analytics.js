import express from 'express';
import { getRevenue, getTopSellingProducts } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/analytics/revenue
router.get('/revenue', authenticate, getRevenue);

// GET /api/analytics/top-selling
router.get('/top-selling', authenticate, getTopSellingProducts);

export default router;