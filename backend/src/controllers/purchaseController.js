import Purchase from '../models/Purchase.js';
import Product from '../models/Product.js';
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

    product.stock += quantity;
    await product.save();

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

    const oldProduct = await Product.findById(existingPurchase.productId);
    if (oldProduct) {
      oldProduct.stock -= existingPurchase.quantity;
      await oldProduct.save();
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

    product.stock += quantity;
    await product.save();

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

    const product = await Product.findById(purchase.productId);
    if (product) {
      product.stock -= purchase.quantity;
      await product.save();
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