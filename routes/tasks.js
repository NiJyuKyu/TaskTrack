const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// Create a new task
router.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  try {
      const task = await newTask.save();
      res.status(201).json(task);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
  try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(task);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: 'Task deleted' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

module.exports = router;