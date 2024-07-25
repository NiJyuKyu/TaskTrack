const express = require('express');
const router = express.Router();
const TodoList = require('../models/ToDoList');

// Create a new to-do
router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Invalid text input' });
    }
    try {
        const newTodo = new TodoList({ text });
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
    const { text } = req.body;
    if (text && typeof text !== 'string') {
        return res.status(400).json({ error: 'Invalid text input' });
    }
    try {
        const updatedTodo = await TodoList.findByIdAndUpdate(id, { text }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
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
