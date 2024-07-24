const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, assignee, dueDate, priority, status } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid name input' });
        }

        const task = new Task({
            name,
            assignee: assignee || '',
            dueDate: dueDate ? new Date(dueDate) : new Date(),
            priority: priority || 'Low',
            status: status || 'To-Do'
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Error adding task', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, assignee, dueDate, priority, status } = req.body;

        if (name && typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid name input' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { name, assignee, dueDate: dueDate ? new Date(dueDate) : undefined, priority, status },
            { new: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

module.exports = router;