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
    const { productId, quantity, supplierId, unitPrice, productName, productSku, supplierName } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    if (supplier.status !== 'Active') {
      return res.status(400).json({ message: 'Cannot purchase from inactive supplier' });
    }

    const purchase = new Purchase({
      productId,
      productName: productName || product.name,
      productSku: productSku || product.sku,
      supplierId,
      supplierName: supplierName || supplier.name,
      quantity,
      unitPrice,
      createdBy: req.user.name
    });

    await purchase.save();

    const oldPrice = product.price;
    if (oldPrice !== unitPrice) {
      product.price = unitPrice;
      await product.save();

      if (oldPrice !== null && oldPrice !== undefined) {
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
    }

    await new ProductHistory({
      product: product._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: null,
      newValue: quantity,
      details: `Stock increased by ${quantity} units via purchase`
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

    res.json({
      success: true,
      purchase,
      invoice,
      message: 'Purchase registered successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, supplierId, unitPrice, productName, productSku, supplierName } = req.body;

    const existingPurchase = await Purchase.findById(id);
    if (!existingPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    if (supplier.status !== 'Active') {
      return res.status(400).json({ message: 'Cannot purchase from inactive supplier' });
    }

    existingPurchase.productId = productId;
    existingPurchase.productName = productName || product.name;
    existingPurchase.productSku = productSku || product.sku;
    existingPurchase.supplierId = supplierId;
    existingPurchase.supplierName = supplierName || supplier.name;
    existingPurchase.quantity = quantity;
    existingPurchase.unitPrice = unitPrice;
    existingPurchase.updatedBy = req.user.name;

    await existingPurchase.save();

    const oldPrice = product.price;
    if (oldPrice !== unitPrice) {
      product.price = unitPrice;
      await product.save();

      if (oldPrice !== null && oldPrice !== undefined) {
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
    }

    await new ProductHistory({
      product: product._id,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: null,
      newValue: quantity,
      details: `Purchase updated - quantity changed to ${quantity} units`
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

    await new ProductHistory({
      product: purchase.productId,
      action: 'stock_changed',
      user: req.user.id,
      userName: req.user.name,
      oldValue: null,
      newValue: -purchase.quantity,
      details: `Stock decreased by ${purchase.quantity} units due to purchase deletion`
    }).save();

    await Purchase.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Purchase deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};