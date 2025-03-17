const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedBy: {
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
    isPublic: {
      type: Boolean,
      default: false
    },
    accessLevel: {
      type: String,
      enum: ['public', 'course', 'private'],
      default: 'private'
    },
    downloads: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ course: 1, createdAt: -1 });
documentSchema.index({ class: 1, createdAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ accessLevel: 1 });

module.exports = mongoose.model('Document', documentSchema);
