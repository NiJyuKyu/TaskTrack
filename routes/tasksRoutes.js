const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Ensure path is correct

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Add a new task
router.post('/', async (req, res) => {
    try {
        const { name, assignee, dueDate, priority, status } = req.body;

        // Basic validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid name input' });
        }

        // Default values for optional fields
        const task = new Task({
            name,
            assignee: assignee || '',
            dueDate: dueDate || new Date(),
            priority: priority || 'Low',
            status: status || 'To-Do'
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const { name, assignee, dueDate, priority, status, completed } = req.body;

        // Basic validation
        if (name && typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid name input' });
        }
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Invalid completed input' });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, { name, assignee, dueDate, priority, status, completed }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

module.exports = router;
