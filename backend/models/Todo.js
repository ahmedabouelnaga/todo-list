const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide a task description'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['personal', 'work', 'shopping'],
    default: 'personal'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);