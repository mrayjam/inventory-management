import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ message: errorMessages[0] });
  }
  next();
};

// Authentication validations
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

export const validateChangePassword = [
  body('currentPassword').isLength({ min: 6 }).withMessage('Current password must be at least 6 characters'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  handleValidationErrors
];

// User validations
export const validateCreateUser = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin']).withMessage('Role must be admin'),
  handleValidationErrors
];

export const validateResetPassword = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  handleValidationErrors
];

// Product validations
export const validateCreateProduct = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('sku').trim().isLength({ min: 1 }).withMessage('SKU is required'),
  body('supplier').optional().trim(),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
  body('description').optional().trim(),
  handleValidationErrors
];

export const validateUpdateProduct = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Product name cannot be empty'),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('Category cannot be empty'),
  body('sku').optional().trim().isLength({ min: 1 }).withMessage('SKU cannot be empty'),
  body('supplier').optional().trim(),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
  body('description').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors
];

export const validateDeleteProduct = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  handleValidationErrors
];

// Supplier validations
export const validateCreateSupplier = [
  body('name').trim().isLength({ min: 1 }).withMessage('Supplier name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];

export const validateUpdateSupplier = [
  param('id').isMongoId().withMessage('Invalid supplier ID'),
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Supplier name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('Category cannot be empty'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];

export const validateDeleteSupplier = [
  param('id').isMongoId().withMessage('Invalid supplier ID'),
  handleValidationErrors
];

// Purchase validations
export const validateCreatePurchase = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('supplierId').isMongoId().withMessage('Invalid supplier ID'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('productName').optional().trim(),
  body('productSku').optional().trim(),
  body('supplierName').optional().trim(),
  handleValidationErrors
];

export const validateUpdatePurchase = [
  param('id').isMongoId().withMessage('Invalid purchase ID'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('supplierId').isMongoId().withMessage('Invalid supplier ID'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('productName').optional().trim(),
  body('productSku').optional().trim(),
  body('supplierName').optional().trim(),
  handleValidationErrors
];

export const validateDeletePurchase = [
  param('id').isMongoId().withMessage('Invalid purchase ID'),
  handleValidationErrors
];

// Sale validations
export const validateCreateSale = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('salePrice').isFloat({ min: 0 }).withMessage('Sale price must be a positive number'),
  body('customer').optional().trim(),
  body('saleDate').optional().isISO8601().withMessage('Sale date must be valid'),
  handleValidationErrors
];

export const validateUpdateSale = [
  param('id').isMongoId().withMessage('Invalid sale ID'),
  body('productId').optional().isMongoId().withMessage('Invalid product ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sale price must be a positive number'),
  body('customer').optional().trim(),
  body('saleDate').optional().isISO8601().withMessage('Sale date must be valid'),
  handleValidationErrors
];

export const validateDeleteSale = [
  param('id').isMongoId().withMessage('Invalid sale ID'),
  handleValidationErrors
];

export const validateGetById = [
  param('id').isMongoId().withMessage('Invalid ID'),
  handleValidationErrors
];