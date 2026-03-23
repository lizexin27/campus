const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'is invalid']
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  token: {
    type: String,
    default: ''
  },
  streak: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);