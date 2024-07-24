const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    item: String,
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('TodoList', todoListSchema);
