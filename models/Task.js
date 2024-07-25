const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assignee: { type: String, default: '' },
    dueDate: { type: Date, default: Date.now },
    priority: { type: String, default: 'Low' },
    status: { type: String, default: 'To-Do' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);