const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class'
    },
    tags: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    visibility: {
      type: String,
      enum: ['public', 'course', 'private'],
      default: 'private'
    },
    featuredImage: {
      type: String
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }]
    }],
    views: {
      type: Number,
      default: 0
    },
    scheduledFor: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ course: 1, createdAt: -1 });
blogSchema.index({ class: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ visibility: 1 });
blogSchema.index({ scheduledFor: 1 });

module.exports = mongoose.model('Blog', blogSchema);
