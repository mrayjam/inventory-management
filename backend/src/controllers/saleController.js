import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import ProductHistory from '../models/ProductHistory.js';

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('Get all sales error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error('Get sale by ID error:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid sale ID format',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

export const createSale = async (req, res) => {
  try {
    const { productId, quantity, salePrice, customer = '', saleDate } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    if (salePrice === undefined || salePrice === null || salePrice < 0) {
      return res.status(400).json({ message: 'Sale price is required and cannot be negative' });
    }

    // Find product and validate existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate sufficient stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}` 
      });
    }

    // Create sale document
    const sale = new Sale({
      productId,
      productName: product.name,
      productSku: product.sku,
      quantity: parseInt(quantity),
      salePrice: parseFloat(salePrice),
      customer: customer || '',
      saleDate: saleDate ? new Date(saleDate) : new Date(),
      createdBy: req.user.name
    });

    await sale.save();

    // Update product stock
    const oldStock = product.stock;
    product.stock -= quantity;
    await product.save();

    // Create product history record
    await new ProductHistory({
      product: product._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: oldStock,
      newValue: product.stock,
      details: `Stock decreased by ${quantity} units via sale (${oldStock} → ${product.stock})`
    }).save();

    // Return both sale and updated product
    res.status(201).json({
      success: true,
      sale: sale.toJSON(),
      product: product.toJSON(),
      message: 'Sale recorded successfully'
    });
  } catch (error) {
    console.error('Create sale error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(e => e.message),
        error: error.message
      });
    }
    
    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: 'Invalid product ID format',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingSale = await Sale.findById(id);
    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const oldProduct = await Product.findById(existingSale.productId);
    if (oldProduct) {
      const oldStock = oldProduct.stock;
      oldProduct.stock += existingSale.quantity;
      await oldProduct.save();

      await new ProductHistory({
        product: oldProduct._id,
        action: 'stock_changed',
        user: req.user.id,
        userName: req.user.name,
        oldValue: oldStock,
        newValue: oldProduct.stock,
        details: `Stock restored by ${existingSale.quantity} units due to sale update (${oldStock} → ${oldProduct.stock})`
      }).save();
    }

    let newProduct = oldProduct;
    if (updates.productId && updates.productId !== existingSale.productId.toString()) {
      newProduct = await Product.findById(updates.productId);
      if (!newProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const newQuantity = updates.quantity || existingSale.quantity;
    if (newProduct.stock < newQuantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${newProduct.stock}, Requested: ${newQuantity}` 
      });
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        existingSale[key] = updates[key];
      }
    });

    if (updates.productId && updates.productId !== oldProduct._id.toString()) {
      existingSale.productName = newProduct.name;
      existingSale.productSku = newProduct.sku;
    }

    existingSale.updatedBy = req.user.name;
    await existingSale.save();

    const newOldStock = newProduct.stock;
    newProduct.stock -= newQuantity;
    await newProduct.save();

    await new ProductHistory({
      product: newProduct._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: newOldStock,
      newValue: newProduct.stock,
      details: `Stock decreased by ${newQuantity} units via sale update (${newOldStock} → ${newProduct.stock})`
    }).save();

    res.json({
      success: true,
      sale: existingSale
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const product = await Product.findById(sale.productId);
    if (product) {
      const oldStock = product.stock;
      product.stock += sale.quantity;
      await product.save();

      await new ProductHistory({
        product: product._id,
        action: 'stock_changed',
        user: req.user.id,
        userName: req.user.name,
        oldValue: oldStock,
        newValue: product.stock,
        details: `Stock restored by ${sale.quantity} units due to sale deletion (${oldStock} → ${product.stock})`
      }).save();
    }

    await Sale.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};