import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true],
    min: [0]
  },
  stock: {
    type: Number,
    required: [true],
    min: [0],
    default: 0
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
