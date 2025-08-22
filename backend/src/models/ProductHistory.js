import mongoose from 'mongoose';

const productHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted', 'stock_changed', 'price_changed', 'image_added', 'image_removed']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  details: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

productHistorySchema.index({ product: 1, createdAt: -1 });

productHistorySchema.methods.toJSON = function() {
  const history = this.toObject();
  history.id = history._id.toString();
  delete history._id;
  delete history.__v;
  return history;
};

const ProductHistory = mongoose.model('ProductHistory', productHistorySchema);

export default ProductHistory;