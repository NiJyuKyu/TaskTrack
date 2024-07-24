const express = require('express');
const router = express.Router();
const TodoList = require('../models/ToDoList'); // Corrected path to the model


// Get all to-do list items
router.get('/', async (req, res) => {
    const todoLists = await TodoList.find();
    res.json(todoLists);
});

// Add a new to-do list item
router.post('/', async (req, res) => {
    const todoList = new TodoList(req.body);
    await todoList.save();
    res.json(todoList);
});

// Update a to-do list item
router.put('/:id', async (req, res) => {
    const todoList = await TodoList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todoList);
});

// Delete a to-do list item
router.delete('/:id', async (req, res) => {
    await TodoList.findByIdAndDelete(req.params.id);
    res.json({ message: 'To-do list item deleted' });
});

module.exports = router;
