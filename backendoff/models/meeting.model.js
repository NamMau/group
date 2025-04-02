const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 240 // 4 hours max
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
meetingSchema.index({ courseId: 1, studentId: 1 });
meetingSchema.index({ date: 1 });
meetingSchema.index({ status: 1 });

// Virtual for formatted date and time
meetingSchema.virtual('formattedDateTime').get(function() {
  return `${this.date.toLocaleDateString()} at ${this.time}`;
});

// Pre-save middleware to validate meeting time
meetingSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('date') || this.isModified('time')) {
    const meetingDate = new Date(this.date);
    const meetingTime = this.time.split(':');
    meetingDate.setHours(parseInt(meetingTime[0]), parseInt(meetingTime[1]), 0);

    if (meetingDate < new Date()) {
      next(new Error('Meeting time cannot be in the past'));
      return;
    }
  }
  next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
