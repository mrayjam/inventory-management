import express from 'express';
import { 
  getAllSales, 
  getSaleById, 
  createSale, 
  updateSale, 
  deleteSale 
} from '../controllers/saleController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateCreateSale, 
  validateUpdateSale, 
  validateDeleteSale,
  validateGetById 
} from '../middleware/validation.js';

const router = express.Router();

// GET /api/sales
router.get('/', authenticate, getAllSales);

// POST /api/sales
router.post('/', authenticate, validateCreateSale, createSale);

// GET /api/sales/:id
router.get('/:id', authenticate, validateGetById, getSaleById);

// PUT /api/sales/:id
router.put('/:id', authenticate, validateUpdateSale, updateSale);

// DELETE /api/sales/:id
router.delete('/:id', authenticate, validateDeleteSale, deleteSale);

export default router;