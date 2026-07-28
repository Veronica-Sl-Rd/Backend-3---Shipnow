import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true]
  },
  quantity: {
    type: Number,
    required: [true],
    min: [1]
  },
  price: {
    type: Number,
    required: [true],
    min: [0]
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true]
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (v) => v.length > 0,
      message: 'El pedido debe tener al menos un item'
    }
  },
  deliveryAddress: {
    type: String,
    required: [true]
  },
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['created', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'created'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    default: null
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
