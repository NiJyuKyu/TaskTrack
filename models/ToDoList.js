const mongoose = require('mongoose');

// Define the schema for ToDoList
const todoListSchema = new mongoose.Schema({
    text: { type: String, required: true }
}, {
    timestamps: true // Optional: Adds createdAt and updatedAt fields
});

// Create the model from the schema
const TodoList = mongoose.model('TodoList', todoListSchema);

module.exports = TodoList;
