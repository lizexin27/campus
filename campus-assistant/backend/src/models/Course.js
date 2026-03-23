const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  teacher: {
    type: String,
    trim: true,
    maxlength: 50
  },
  room: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid start time format'
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid end time format'
    }
  },
  weekDay: {
    type: Number,
    min: 1,
    max: 7,
    required: true
  },
  weekRange: {
    type: String,
    required: true,
    default: '1-16',
    validate: {
      validator: function(v) {
        return /^(\d+(-\d+)?(,\d+(-\d+)?)*|\d+)$/.test(v);
      },
      message: 'Invalid week range format'
    }
  },
  color: {
    type: String,
    default: '#4A90E2',
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Invalid color format'
    }
  },
  ocrData: {
    type: Schema.Types.Mixed,
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

courseSchema.index({ userId: 1, weekDay: 1 });
courseSchema.index({ userId: 1, weekRange: 1 });

module.exports = mongoose.model('Course', courseSchema);