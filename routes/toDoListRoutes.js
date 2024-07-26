const express = require('express');
const router = express.Router();
const TodoList = require('../models/ToDoList'); // Ensure this path is correct

// Get all to-dos
router.get('/', async (req, res) => {
    try {
        const todos = await TodoList.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos', message: error.message });
    }
});

// Create a new to-do
router.post('/', async (req, res) => {
    const { title } = req.body; // Changed to 'title' based on frontend
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Invalid title input' }); // Changed error message
    }
    try {
        const newTodo = new TodoList({ title }); // Changed to 'title'
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error saving todo:', error);
        res.status(500).json({ error: 'Failed to add todo', message: error.message });
    }
});

// Update a to-do
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body; // Changed to 'title'
    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'Invalid title input' }); // Changed error message
    }
    try {
        const updatedTodo = await TodoList.findByIdAndUpdate(id, { title }, { new: true }); // Changed to 'title'
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            _id: updatedTodo._id,
            title: updatedTodo.title // Changed to 'title'
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo', message: error.message });
    }
});

// Delete a to-do
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await TodoList.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo', message: error.message });
    }
});

module.exports = router;
