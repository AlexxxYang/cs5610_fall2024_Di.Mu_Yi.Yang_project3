import mongoose from 'mongoose';
const { Schema } = mongoose;

export const PostSchema = new Schema({
  content: {
    type: String,
    required: function() {
      return !this.image; // 如果有图片,则content不是必需的
    },
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: null
  }
}, { collection: 'posts' });