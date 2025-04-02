const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    category: { 
      type: String,
      trim: true 
    },
    level: { 
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'], 
      default: 'Beginner'
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      }
    ],
    status: {
      type: String,
      enum: ['not_started', 'ongoing', 'finished', 'canceled'],
      default: 'not_started'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
