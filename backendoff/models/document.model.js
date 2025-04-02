const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'graded', 'returned'],
    default: 'draft'
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'txt']
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
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
}, {
  timestamps: true,
  indexes: [
    { courseId: 1, studentId: 1 },
    { submissionDate: -1 },
    { status: 1 }
  ]
});

// Indexes for better query performance
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ course: 1, createdAt: -1 });
documentSchema.index({ class: 1, createdAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ accessLevel: 1 });

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function() {
  return `/uploads/documents/${this._id}${path.extname(this.filePath)}`;
});

// Pre-save middleware to set fileType and fileSize
documentSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('filePath')) {
    const ext = path.extname(this.filePath).toLowerCase().slice(1);
    this.fileType = ext;
    
    // Get file size
    fs.stat(this.filePath, (err, stats) => {
      if (err) {
        next(err);
        return;
      }
      this.fileSize = stats.size;
      next();
    });
  } else {
    next();
  }
});

// Cascade delete - remove file when document is deleted
documentSchema.pre('remove', async function(next) {
  try {
    await fs.unlink(this.filePath);
    next();
  } catch (error) {
    next(error);
  }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
