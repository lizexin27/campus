const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  time: {
    type: Date,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  repeat: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'none'],
    default: 'none'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, time: 1 });

module.exports = mongoose.model('Todo', todoSchema);