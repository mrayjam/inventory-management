import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductHistory
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateCreateProduct, 
  validateUpdateProduct, 
  validateDeleteProduct,
  validateGetById 
} from '../middleware/validation.js';
import { createUpload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', authenticate, getAllProducts);

router.post('/', authenticate, (req, res, next) => {
  const upload = createUpload();
  upload.array('images', 5)(req, res, next);
}, validateCreateProduct, createProduct);

router.get('/:id', authenticate, validateGetById, getProductById);

router.get('/:id/history', authenticate, validateGetById, getProductHistory);

router.put('/:id', authenticate, (req, res, next) => {
  const upload = createUpload();
  upload.array('images', 5)(req, res, next);
}, validateUpdateProduct, updateProduct);

router.delete('/:id', authenticate, validateDeleteProduct, deleteProduct);

export default router;