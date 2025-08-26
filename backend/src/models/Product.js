import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
productSchema.index({ category: 1 }); // For filtering by category
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ createdAt: -1 }); // For sorting by creation date
productSchema.index({ stock: 1 }); // For stock filtering
productSchema.index({ price: 1 }); // For price filtering

productSchema.methods.toJSON = function() {
  const product = this.toObject();
  product.id = product._id.toString();
  delete product._id;
  delete product.__v;
  return product;
};

const Product = mongoose.model('Product', productSchema);

export default Product;