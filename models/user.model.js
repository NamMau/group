const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'tutor', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Additional fields for eTutoring system
    personalTutor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return this.role === 'student';
      }
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    department: String,
    studentId: String,
    phoneNumber: String,
    lastLogin: Date,
    loginHistory: [{
      date: Date,
      ip: String,
      device: String
    }],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      meetingReminders: {
        type: Boolean,
        default: true
      },
      messageNotifications: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ personalTutor: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
