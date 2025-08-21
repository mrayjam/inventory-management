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

router.get('/', authenticate, getAllProducts);

router.post('/', authenticate, validateCreateProduct, createProduct);

router.get('/:id', authenticate, validateGetById, getProductById);

router.put('/:id', authenticate, validateUpdateProduct, updateProduct);

router.delete('/:id', authenticate, validateDeleteProduct, deleteProduct);

export default router;