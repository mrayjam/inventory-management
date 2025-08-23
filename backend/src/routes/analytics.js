import express from 'express';
import { 
  getRevenue, 
  getTopSellingProducts, 
  getSalesTrend, 
  getInventoryByCategory, 
  getCategoryDistribution,
  getInventoryValue,
  getAdvancedMetrics 
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/revenue', authenticate, getRevenue);

router.get('/top-selling', authenticate, getTopSellingProducts);

router.get('/sales-trend', authenticate, getSalesTrend);

router.get('/inventory-by-category', authenticate, getInventoryByCategory);

router.get('/category-distribution', authenticate, getCategoryDistribution);

router.get('/inventory-value', authenticate, getInventoryValue);

router.get('/advanced-metrics', authenticate, getAdvancedMetrics);

export default router;