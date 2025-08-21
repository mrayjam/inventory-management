import express from 'express';
import { 
  getAllPurchases, 
  getPurchaseById, 
  createPurchase, 
  updatePurchase, 
  deletePurchase 
} from '../controllers/purchaseController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateCreatePurchase, 
  validateUpdatePurchase, 
  validateDeletePurchase,
  validateGetById 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, getAllPurchases);

router.post('/', authenticate, validateCreatePurchase, createPurchase);

router.get('/:id', authenticate, validateGetById, getPurchaseById);

router.put('/:id', authenticate, validateUpdatePurchase, updatePurchase);

router.delete('/:id', authenticate, validateDeletePurchase, deletePurchase);

export default router;