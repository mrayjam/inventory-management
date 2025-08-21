import Product from '../models/Product.js';
import { getCloudinary } from '../config/cloudinary.js';

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
    console.log('Create Product Request:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { name, category, sku, supplier, description } = req.body;

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
      supplier: supplier || '',
      imageUrl: images.length > 0 ? images[0].url : 'https://via.placeholder.com/300',
      images,
      description: description || 'No description provided',
      stock: 0
    });

    console.log('Creating product with data:', product);

    await product.save();

    console.log('Product created successfully:', product.id);

    res.json({
      success: true,
      data: product
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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (updates.sku && updates.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: updates.sku.toUpperCase() });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      updates.sku = updates.sku.toUpperCase();
    }

    if (req.files && req.files.length > 0) {
      console.log('Processing uploaded files for update:', req.files.length);
      const newImages = [];
      req.files.forEach((file, index) => {
        console.log(`Update File ${index}:`, {
          originalname: file.originalname,
          path: file.path,
          filename: file.filename
        });
        newImages.push({
          url: file.path,
          publicId: file.filename
        });
      });

      if (updates.replaceImages === 'true') {
        console.log('Replacing all existing images');
        if (product.images && product.images.length > 0) {
          for (const image of product.images) {
            try {
              await getCloudinary().uploader.destroy(image.publicId);
              console.log('Deleted image from Cloudinary:', image.publicId);
            } catch (error) {
              console.error('Failed to delete image from Cloudinary:', error);
            }
          }
        }
        updates.images = newImages;
        updates.imageUrl = newImages.length > 0 ? newImages[0].url : 'https://via.placeholder.com/300';
      } else {
        console.log('Adding new images to existing ones');
        updates.images = [...(product.images || []), ...newImages];
        if (newImages.length > 0) {
          updates.imageUrl = newImages[0].url;
        }
      }
    }

    if (updates.removeImageIds) {
      console.log('Removing images:', updates.removeImageIds);
      const removeIds = JSON.parse(updates.removeImageIds);
      const remainingImages = product.images.filter(img => !removeIds.includes(img.publicId));
      
      for (const imageId of removeIds) {
        try {
          await getCloudinary().uploader.destroy(imageId);
          console.log('Deleted image from Cloudinary:', imageId);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      }
      
      updates.images = remainingImages;
      updates.imageUrl = remainingImages.length > 0 ? remainingImages[0].url : 'https://via.placeholder.com/300';
    }

    console.log('Final updates object:', updates);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    console.log('Product updated successfully:', updatedProduct.id);

    res.json({
      success: true,
      data: updatedProduct
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

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

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};