import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productName: {
    type: String,
    required: false
  },
  productSku: {
    type: String,
    required: false
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  supplierName: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: false
  },
  purchaseDate: {
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
purchaseSchema.index({ product: 1 });
purchaseSchema.index({ supplier: 1 });
purchaseSchema.index({ purchaseDate: -1 });
purchaseSchema.index({ createdAt: -1 });
purchaseSchema.index({ createdBy: 1 });
purchaseSchema.index({ product: 1, purchaseDate: -1 });

purchaseSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

purchaseSchema.methods.toJSON = function() {
  const purchase = this.toObject();
  purchase.id = purchase._id.toString();
  purchase.productId = purchase.product.toString();
  purchase.supplierId = purchase.supplier.toString();
  purchase.purchaseDate = purchase.purchaseDate.toISOString().split('T')[0];
  purchase.createdAt = purchase.createdAt.toISOString();
  if (purchase.updatedAt) {
    purchase.updatedAt = purchase.updatedAt.toISOString();
  }
  delete purchase._id;
  delete purchase.__v;
  return purchase;
};

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;