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
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // Additional fields for eTutoring system
    personalTutor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

//pre save hook studentid to student if not havs
userSchema.pre('save', async function(next){
  if(this.role === 'student' && !this.studentId) {
    this.studentId = this._id.toString(); // Generate a unique student ID
  }
  next();
});


// assign students to personal tutor then save the list
userSchema.post('save', async function (doc) {
  if (doc.role === 'student' && doc.personalTutor) {
    const tutor = await mongoose.model('User').findById(doc.personalTutor);
    if (tutor && tutor.role === 'tutor') {
      if (!tutor.students.includes(doc._id)) {
        tutor.students.push(doc._id);
        await tutor.save();
      }
    }
  }
});

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ personalTutor: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
