const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: String,
    assignee: String,
    dueDate: Date,
    priority: { type: String, enum: ['High', 'Low'] },
    status: { type: String, enum: ['To-do', 'Ongoing', 'Complete'] }
});

module.exports = mongoose.model('Task', taskSchema);
