import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        documentType: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

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
    type: [documentSchema],
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
