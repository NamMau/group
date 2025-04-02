const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String
    }],
    relatedTo: {
      type: {
        type: String,
        enum: ['course', 'meeting', 'document', 'blog'],
        required: false
      },
      id: {
        type: Schema.Types.ObjectId,
        refPath: 'relatedTo.type'
      }
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
