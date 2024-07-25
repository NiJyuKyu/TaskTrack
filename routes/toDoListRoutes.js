const express = require('express');
const router = express.Router();
const TodoList = require('../models/ToDoList'); // Correct path to the model

// Get all to-do list items
router.get('/', async (req, res) => {
    try {
        const todoLists = await TodoList.find();
        res.json(todoLists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching to-do lists', error });
    }
});

// Add a new to-do list item
router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        // Basic validation
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const todoList = new TodoList({ text });
        await todoList.save();
        res.status(201).json(todoList);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to-do list item', error });
    }
});

// Update a to-do list item
router.put('/:id', async (req, res) => {
    try {
        const { text, completed } = req.body;

        // Basic validation
        if (text && typeof text !== 'string') {
            return res.status(400).json({ message: 'Invalid text input' });
        }
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Invalid completed input' });
        }

        const todoList = await TodoList.findByIdAndUpdate(req.params.id, { text, completed }, { new: true });
        if (!todoList) {
            return res.status(404).json({ message: 'To-do list item not found' });
        }
        res.json(todoList);
    } catch (error) {
        res.status(500).json({ message: 'Error updating to-do list item', error });
    }
});

// Delete a to-do list item
router.delete('/:id', async (req, res) => {
    try {
        const todoList = await TodoList.findByIdAndDelete(req.params.id);
        if (!todoList) {
            return res.status(404).json({ message: 'To-do list item not found' });
        }
        res.json({ message: 'To-do list item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting to-do list item', error });
    }
});

module.exports = router;
