import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productName: {
    type: String,
    required: true
  },
  productSku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  customer: {
    type: String,
    trim: true,
    default: ''
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
saleSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.salePrice;
  next();
});

// Transform output to match API spec
saleSchema.methods.toJSON = function() {
  const sale = this.toObject();
  sale.id = sale._id.toString();
  sale.productId = sale.productId.toString();
  sale.saleDate = sale.saleDate.toISOString();
  sale.createdAt = sale.createdAt.toISOString();
  if (sale.updatedAt) {
    sale.updatedAt = sale.updatedAt.toISOString();
  }
  delete sale._id;
  delete sale.__v;
  return sale;
};

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;