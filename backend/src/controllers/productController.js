import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, sku, supplier, imageUrl, description } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const product = new Product({
      name,
      category,
      sku: sku.toUpperCase(),
      supplier,
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      description: description || 'No description provided',
      stock: 0 // Stock starts at 0, updated through purchases
    });

    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If SKU is being updated, check uniqueness
    if (updates.sku && updates.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: updates.sku.toUpperCase() });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      updates.sku = updates.sku.toUpperCase();
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};