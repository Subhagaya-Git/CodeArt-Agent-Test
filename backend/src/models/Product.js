const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
    category: { type: String, required: [true, 'Category is required'], trim: true, lowercase: true },
    image_url: { type: String, default: '' },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);