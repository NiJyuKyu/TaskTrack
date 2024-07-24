const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('TodoList', todoListSchema);
