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

router.get('/', authenticate, getAllSales);

router.post('/', authenticate, validateCreateSale, createSale);

router.get('/:id', authenticate, validateGetById, getSaleById);

router.put('/:id', authenticate, validateUpdateSale, updateSale);

router.delete('/:id', authenticate, validateDeleteSale, deleteSale);

export default router;