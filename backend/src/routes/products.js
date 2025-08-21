import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateCreateProduct, 
  validateUpdateProduct, 
  validateDeleteProduct,
  validateGetById 
} from '../middleware/validation.js';

const router = express.Router();

// GET /api/products
router.get('/', authenticate, getAllProducts);

// POST /api/products
router.post('/', authenticate, validateCreateProduct, createProduct);

// GET /api/products/:id
router.get('/:id', authenticate, validateGetById, getProductById);

// PUT /api/products/:id
router.put('/:id', authenticate, validateUpdateProduct, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authenticate, validateDeleteProduct, deleteProduct);

export default router;