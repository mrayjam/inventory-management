import express from 'express';
import { 
  getAllSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/supplierController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateCreateSupplier, 
  validateUpdateSupplier, 
  validateDeleteSupplier,
  validateGetById 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, getAllSuppliers);

router.post('/', authenticate, validateCreateSupplier, createSupplier);

router.get('/:id', authenticate, validateGetById, getSupplierById);

router.put('/:id', authenticate, validateUpdateSupplier, updateSupplier);

router.delete('/:id', authenticate, validateDeleteSupplier, deleteSupplier);

export default router;