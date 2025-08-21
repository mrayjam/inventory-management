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

// GET /api/purchases
router.get('/', authenticate, getAllPurchases);

// POST /api/purchases
router.post('/', authenticate, validateCreatePurchase, createPurchase);

// GET /api/purchases/:id
router.get('/:id', authenticate, validateGetById, getPurchaseById);

// PUT /api/purchases/:id
router.put('/:id', authenticate, validateUpdatePurchase, updatePurchase);

// DELETE /api/purchases/:id
router.delete('/:id', authenticate, validateDeletePurchase, deletePurchase);

export default router;