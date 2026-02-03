import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    reservedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'completed'],
      default: 'active',
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
      default: 'pickup',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank-transfer', 'twint'],
      required: true,
      default: 'cash',
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingAddress: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      street: { type: String, default: '' },
      streetNumber: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      city: { type: String, default: '' },
      canton: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    customerEmail: {
      type: String,
      default: '',
    },
    customerName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Reservation', reservationSchema);
