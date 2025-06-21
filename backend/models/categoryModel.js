import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  nop: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;