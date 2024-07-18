const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);