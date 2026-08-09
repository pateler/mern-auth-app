import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Footwear', 'Apparel', 'Accessories', 'Electronics', 'Others'],
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      default: 10,
    },
    images: [{
      url: String,
      alt: String,
    }],
    soldThisMonth: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Healthy', 'Low Stock', 'Critical', 'Out of Stock'],
      default: 'Healthy',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// FIXED: Use async/await without next parameter
productSchema.pre('save', function () {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock <= this.minStockLevel * 0.3) {
    this.status = 'Critical';
  } else if (this.stock <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Healthy';
  }
});

export default mongoose.model('Product', productSchema);