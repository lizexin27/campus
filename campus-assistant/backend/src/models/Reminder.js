const mongoose = require('mongoose');
const { Schema } = mongoose;

const reminderSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    trim: true,
    maxlength: 500
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format'
    }
  },
  type: {
    type: String,
    enum: ['todo', 'course'],
    required: true
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'type',
    required: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

reminderSchema.index({ userId: 1, type: 1 });
reminderSchema.index({ userId: 1, enabled: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);