import Purchase from '../models/Purchase.js';
import Product from '../models/Product.js';
import ProductHistory from '../models/ProductHistory.js';
import Supplier from '../models/Supplier.js';

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const { productId, supplierId, quantity, unitPrice } = req.body;

    if (!productId || !supplierId || !quantity || !unitPrice) {
      return res.status(400).json({ message: 'Missing required fields: productId, supplierId, quantity, unitPrice' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    if (unitPrice < 0) {
      return res.status(400).json({ message: 'Unit price cannot be negative' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Selected product does not exist' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Selected supplier does not exist' });
    }

    if (supplier.status !== 'Active') {
      return res.status(400).json({ message: 'Cannot purchase from inactive supplier' });
    }

    const purchase = new Purchase({
      product: productId,
      productName: product.name,
      productSku: product.sku,
      supplier: supplierId,
      supplierName: supplier.name,
      quantity,
      unitPrice,
      createdBy: req.user.name
    });

    await purchase.save();

    const oldStock = product.stock;
    const oldPrice = product.price;
    
    product.stock += quantity;
    if (oldPrice !== unitPrice) {
      product.price = unitPrice;
    }
    
    await product.save();

    if (oldPrice !== null && oldPrice !== undefined && oldPrice !== unitPrice) {
      await new ProductHistory({
        product: product._id,
        action: 'price_changed',
        user: req.user.id,
        userName: req.user.name,
        oldValue: oldPrice,
        newValue: unitPrice,
        details: `Price updated from $${oldPrice} to $${unitPrice} via purchase`
      }).save();
    }

    await new ProductHistory({
      product: product._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: oldStock,
      newValue: product.stock,
      details: `Stock increased by ${quantity} units via purchase (${oldStock} → ${product.stock})`
    }).save();

    const invoice = {
      id: `INV-${Date.now()}`,
      purchaseId: purchase.id,
      date: new Date().toLocaleDateString(),
      totalAmount: purchase.totalAmount.toFixed(2),
      status: 'Paid',
      generatedBy: req.user.name,
      generatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      purchase,
      invoice,
      message: 'Purchase registered successfully'
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product or supplier ID format' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, supplierId, quantity, unitPrice } = req.body;

    const existingPurchase = await Purchase.findById(id);
    if (!existingPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    const oldProduct = await Product.findById(existingPurchase.product);
    if (oldProduct) {
      oldProduct.stock -= existingPurchase.quantity;
      await oldProduct.save();
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Selected product does not exist' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Selected supplier does not exist' });
    }

    if (supplier.status !== 'Active') {
      return res.status(400).json({ message: 'Cannot purchase from inactive supplier' });
    }

    const oldStock = product.stock;
    const oldPrice = product.price;
    
    product.stock += quantity;
    if (oldPrice !== unitPrice) {
      product.price = unitPrice;
    }

    existingPurchase.product = productId;
    existingPurchase.productName = product.name;
    existingPurchase.productSku = product.sku;
    existingPurchase.supplier = supplierId;
    existingPurchase.supplierName = supplier.name;
    existingPurchase.quantity = quantity;
    existingPurchase.unitPrice = unitPrice;
    existingPurchase.updatedBy = req.user.name;

    await existingPurchase.save();
    await product.save();

    if (oldPrice !== null && oldPrice !== undefined && oldPrice !== unitPrice) {
      await new ProductHistory({
        product: product._id,
        action: 'price_changed',
        user: req.user.id,
        userName: req.user.name,
        oldValue: oldPrice,
        newValue: unitPrice,
        details: `Price updated from $${oldPrice} to $${unitPrice} via purchase update`
      }).save();
    }

    await new ProductHistory({
      product: product._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: oldStock,
      newValue: product.stock,
      details: `Purchase updated - stock changed by ${quantity} units (${oldStock} → ${product.stock})`
    }).save();

    res.json({
      success: true,
      purchase: existingPurchase,
      message: 'Purchase updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    const product = await Product.findById(purchase.product);
    if (product) {
      const oldStock = product.stock;
      product.stock -= purchase.quantity;
      
      if (product.stock < 0) {
        product.stock = 0;
      }
      
      await product.save();

      await new ProductHistory({
        product: purchase.product,
        action: 'stock_changed',
        user: req.user.id,
        userName: req.user.name,
        oldValue: oldStock,
        newValue: product.stock,
        details: `Stock decreased by ${purchase.quantity} units due to purchase deletion (${oldStock} → ${product.stock})`
      }).save();
    }

    await Purchase.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Purchase deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};