const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['not_started', 'ongoing', 'finished', 'canceled'],
      default: 'not_started',
    },
    // Possibly link to a Course if needed
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
