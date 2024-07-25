const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    text: { type: String, required: true }, // Changed 'item' to 'text'
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('TodoList', todoListSchema);
