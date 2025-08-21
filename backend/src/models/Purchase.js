import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
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
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  supplierName: {
    type: String,
    required: true
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
    required: true
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

purchaseSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

purchaseSchema.methods.toJSON = function() {
  const purchase = this.toObject();
  purchase.id = purchase._id.toString();
  purchase.productId = purchase.productId.toString();
  purchase.supplierId = purchase.supplierId.toString();
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