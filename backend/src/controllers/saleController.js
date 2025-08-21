import Sale from '../models/Sale.js';
import Product from '../models/Product.js';

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createSale = async (req, res) => {
  try {
    const { productId, quantity, salePrice, customer = '', saleDate } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}` 
      });
    }

    const sale = new Sale({
      productId,
      productName: product.name,
      productSku: product.sku,
      quantity,
      salePrice,
      customer,
      saleDate: saleDate ? new Date(saleDate) : new Date(),
      createdBy: req.user.name
    });

    await sale.save();

    product.stock -= quantity;
    await product.save();

    res.json({
      success: true,
      sale,
      message: 'Sale recorded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
      oldProduct.stock += existingSale.quantity;
      await oldProduct.save();
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

    newProduct.stock -= newQuantity;
    await newProduct.save();

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
      product.stock += sale.quantity;
      await product.save();
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