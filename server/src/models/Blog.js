import mongoose from 'mongoose';
import { CATEGORIES, COVER_THEMES } from '../constants.js';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A title is required'],
      trim: true,
      minlength: [3, 'Title is too short'],
      maxlength: [120, 'Title is too long'],
    },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: {
      type: String,
      default: '',
      maxlength: [280, 'Excerpt is too long'],
    },
    content: {
      type: String,
      required: [true, 'Story content is required'],
      minlength: [40, 'Give your story a little more room to breathe'],
    },
    coverImage: { type: String, default: '', maxlength: 500 },
    coverTheme: {
      type: String,
      enum: COVER_THEMES,
      default: 'lime',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Life',
      index: true,
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 24 }],
      validate: [(tags) => tags.length <= 5, 'Use up to 5 tags'],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    readTime: { type: Number, default: 1, min: 1 },
    views: { type: Number, default: 0, min: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });

export default mongoose.model('Blog', blogSchema);
