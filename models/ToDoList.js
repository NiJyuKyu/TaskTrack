const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    title: { type: String, required: true }
});

module.exports = mongoose.model('ToDoList', todoListSchema);
