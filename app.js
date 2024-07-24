const express = require('express');
const connectDB = require('./config/db');
const tasksRoutes = require('./routes/tasks');
const noteRoutes = require('./routes/notes');
const toDoListRoutes = require('./routes/todolists');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/tasks', tasksRoutes); // Tasks route
app.use('/notes', noteRoutes); // Notes route
app.use('/todolists', toDoListRoutes); // To-Do Lists route


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));