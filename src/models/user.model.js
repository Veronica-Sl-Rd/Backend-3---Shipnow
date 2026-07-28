import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true],
    trim: true
  },

  lastName: {
    type: String,
    required: [true],
    trim: true
  },

  email: {
    type: String,
    required: [true],
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true]
  },

  role: {
    type: String,
    enum: ['admin', 'customer', 'driver', 'store'],
    default: 'customer'
  },

  city: {
    type: String,
    trim: true
  },

  available: {
    type: Boolean,
    default: true
  },

  vehicle: {
    type: String,
    enum: ['bike', 'motorcycle', 'car']
  },
  
  documents: {
    type: [
      {
        name: { type: String },
        reference: { type: String }
      }
    ],
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
