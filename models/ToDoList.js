const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

const TodoList = mongoose.model('TodoList', todoListSchema);

module.exports = TodoList;
