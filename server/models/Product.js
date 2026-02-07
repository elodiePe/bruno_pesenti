import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    date: {
      type: String,
      default: new Date().toISOString().split('T')[0],
    },
    contact: {
      type: String,
      default: '',
    },
    weight: {
      type: Number,
      default: 0,
    },

    youtubeUrl: {
      type: String,
      default: '',
    },
  },


  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
