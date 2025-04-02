const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: 0
  },
  activityType: {
    type: String,
    enum: ['video', 'reading', 'exercise', 'quiz', 'other'],
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
studySessionSchema.index({ studentId: 1, date: -1 });
studySessionSchema.index({ courseId: 1, studentId: 1 });

module.exports = mongoose.model('StudySession', studySessionSchema); 