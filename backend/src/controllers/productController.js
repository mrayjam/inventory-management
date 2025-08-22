import Product from '../models/Product.js';
import ProductHistory from '../models/ProductHistory.js';
import Purchase from '../models/Purchase.js';
import Sale from '../models/Sale.js';
import { getCloudinary } from '../config/cloudinary.js';

const calculateProductStock = async (productId) => {
  const purchases = await Purchase.aggregate([
    { $match: { productId: productId } },
    { $group: { _id: null, totalPurchased: { $sum: '$quantity' } } }
  ]);
  
  const sales = await Sale.aggregate([
    { $match: { productId: productId } },
    { $group: { _id: null, totalSold: { $sum: '$quantity' } } }
  ]);
  
  const totalPurchased = purchases.length > 0 ? purchases[0].totalPurchased : 0;
  const totalSold = sales.length > 0 ? sales[0].totalSold : 0;
  
  return Math.max(0, totalPurchased - totalSold);
};

const getLatestPurchasePrice = async (productId) => {
  const latestPurchase = await Purchase.findOne({ productId }).sort({ createdAt: -1 });
  return latestPurchase ? latestPurchase.unitPrice : null;
};

const createProductHistory = async (productId, action, userId, userName, oldValue = null, newValue = null, details = '', metadata = {}) => {
  try {
    const history = new ProductHistory({
      product: productId,
      action,
      user: userId,
      userName,
      oldValue,
      newValue,
      details,
      metadata
    });
    await history.save();
  } catch (error) {
    console.error('Failed to create product history:', error);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });
    
    const productsWithCalculatedData = await Promise.all(
      products.map(async (product) => {
        const productObj = product.toJSON();
        productObj.stock = await calculateProductStock(product._id);
        if (!productObj.price) {
          productObj.price = await getLatestPurchasePrice(product._id) || 0;
        }
        return productObj;
      })
    );
    
    res.json(productsWithCalculatedData);
  } catch (error) {
    console.error('Get all products error:', error);
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

    const productObj = product.toJSON();
    productObj.stock = await calculateProductStock(product._id);
    if (!productObj.price) {
      productObj.price = await getLatestPurchasePrice(product._id) || 0;
    }

    res.json(productObj);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log('Create Product Request:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { name, category, sku, description } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || 'Admin';

    if (!name || !category || !sku) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, category, and sku are required' 
      });
    }

    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({ message: 'SKU already exists' });
    }


    const images = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing uploaded files:', req.files.length);
      req.files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          originalname: file.originalname,
          path: file.path,
          filename: file.filename
        });
        images.push({
          url: file.path,
          publicId: file.filename
        });
      });
    }

    const product = new Product({
      name,
      category,
      sku: sku.toUpperCase(),
      imageUrl: images.length > 0 ? images[0].url : 'https://via.placeholder.com/300',
      images,
      description: description || 'No description provided'
    });

    console.log('Creating product with data:', product);
    await product.save();

    if (userId) {
      await createProductHistory(
        product._id,
        'created',
        userId,
        userName,
        null,
        product.toJSON(),
        `Product "${name}" created`
      );
    }

    const responseData = product.toJSON();
    responseData.stock = 0;
    responseData.price = 0;

    console.log('Product created successfully:', product.id);

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message, stack: error.stack })
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log('Update Product Request:');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || 'Admin';

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const oldProductData = product.toJSON();

    if (updates.sku && updates.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: updates.sku.toUpperCase() });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      updates.sku = updates.sku.toUpperCase();
    }

    let historyEvents = [];
    let currentImages = [...(product.images || [])];

    if (updates.deletedImages) {
      console.log('Processing deleted images:', updates.deletedImages);
      let deletedImageIds = [];
      
      try {
        deletedImageIds = typeof updates.deletedImages === 'string' 
          ? JSON.parse(updates.deletedImages) 
          : updates.deletedImages;
      } catch (error) {
        console.error('Failed to parse deletedImages:', error);
        return res.status(400).json({ message: 'Invalid deletedImages format' });
      }

      if (Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
        for (const publicId of deletedImageIds) {
          try {
            await getCloudinary().uploader.destroy(publicId);
            console.log('Deleted image from Cloudinary:', publicId);
          } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
          }
        }
        
        currentImages = currentImages.filter(img => !deletedImageIds.includes(img.publicId));
        historyEvents.push({
          action: 'image_removed',
          details: `Removed ${deletedImageIds.length} image(s)`
        });
      }
      delete updates.deletedImages;
    }

    if (req.files && req.files.length > 0) {
      console.log('Processing new uploaded files:', req.files.length);
      const newImages = [];
      req.files.forEach((file, index) => {
        console.log(`New File ${index}:`, {
          originalname: file.originalname,
          path: file.path,
          filename: file.filename
        });
        newImages.push({
          url: file.path,
          publicId: file.filename
        });
      });

      currentImages = [...currentImages, ...newImages];
      historyEvents.push({
        action: 'image_added',
        details: `Added ${newImages.length} new image(s)`
      });
    }

    updates.images = currentImages;
    updates.imageUrl = currentImages.length > 0 ? currentImages[0].url : 'https://via.placeholder.com/300';

    console.log('Final updates object:', updates);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (userId) {
      for (const event of historyEvents) {
        await createProductHistory(
          updatedProduct._id,
          event.action,
          userId,
          userName,
          null,
          null,
          event.details
        );
      }

      if (updates.name && updates.name !== oldProductData.name) {
        await createProductHistory(
          updatedProduct._id,
          'updated',
          userId,
          userName,
          oldProductData.name,
          updates.name,
          'Product name updated'
        );
      }

      if (updates.description && updates.description !== oldProductData.description) {
        await createProductHistory(
          updatedProduct._id,
          'updated',
          userId,
          userName,
          oldProductData.description,
          updates.description,
          'Product description updated'
        );
      }

      if (updates.category && updates.category !== oldProductData.category) {
        await createProductHistory(
          updatedProduct._id,
          'updated',
          userId,
          userName,
          oldProductData.category,
          updates.category,
          'Product category updated'
        );
      }
    }

    const responseData = updatedProduct.toJSON();
    responseData.stock = await calculateProductStock(updatedProduct._id);
    if (!responseData.price) {
      responseData.price = await getLatestPurchasePrice(updatedProduct._id) || 0;
    }

    console.log('Product updated successfully:', updatedProduct.id);

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message, stack: error.stack })
    });
  }
};

export const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const history = await ProductHistory.find({ product: id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedHistory = history.map(entry => ({
      id: entry.id,
      action: entry.action,
      user: entry.userName,
      date: entry.createdAt.toISOString().split('T')[0],
      details: entry.details || `${entry.action} action performed`,
      timestamp: entry.createdAt
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Get product history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userName = req.user?.name || 'Admin';

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await getCloudinary().uploader.destroy(image.publicId);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      }
    }

    if (userId) {
      await createProductHistory(
        product._id,
        'deleted',
        userId,
        userName,
        product.toJSON(),
        null,
        `Product "${product.name}" deleted`
      );
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};