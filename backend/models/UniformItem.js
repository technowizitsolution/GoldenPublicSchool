import mongoose from 'mongoose';

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  }
}, { _id: false });

const uniformItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Shirt', 'Pants', 'Shoes', 'Belt', 'Tie', 'Socks (pair)'],
    unique: true,
  },
  
  sizes: [sizeStockSchema],
  
  totalStock: {
    type: Number,
    required: true,
    default: 0,
  },
  
  issued: {
    type: Number,
    default: 0,
  },
  
  damaged: {
    type: Number,
    default: 0,
  },
  
  available: {
    type: Number,
    default: 0,
  },
  
  description: {
    type: String,
    required: false,
  },
  
  reorderLevel: {
    type: Number,
    default: 20,
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
}, { timestamps: true });

// Calculate available stock
uniformItemSchema.virtual('availableStock').get(function() {
  return this.totalStock - this.issued - this.damaged;
});

export default mongoose.model('UniformItem', uniformItemSchema);