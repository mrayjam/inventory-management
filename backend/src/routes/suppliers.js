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

// GET /api/suppliers
router.get('/', authenticate, getAllSuppliers);

// POST /api/suppliers
router.post('/', authenticate, validateCreateSupplier, createSupplier);

// GET /api/suppliers/:id
router.get('/:id', authenticate, validateGetById, getSupplierById);

// PUT /api/suppliers/:id
router.put('/:id', authenticate, validateUpdateSupplier, updateSupplier);

// DELETE /api/suppliers/:id
router.delete('/:id', authenticate, validateDeleteSupplier, deleteSupplier);

export default router;