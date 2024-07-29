const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const tasksRoutes = require('./routes/tasksRoutes');
const noteRoutes = require('./routes/noteRoutes');
const toDoListRoutes = require('./routes/toDoListRoutes');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variables for secrets
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasktrack';

// Database connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(`MongoDB connection error: ${err}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    profilePicture: { type: String },
    avatar: String
});

const User = mongoose.model('User', userSchema);

const EventSchema = new mongoose.Schema({
    title: String,
    date: Date
});

const Event = mongoose.model('Event', EventSchema);


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created, please log in' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// New route to check authentication
app.get('/api/check-auth', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.json({ authenticated: false });
        res.json({ authenticated: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
app.get('/user-profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ username: user.username, avatarUrl: user.profilePicture });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
app.post('/update-profile', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const { username } = req.body;
        const updateData = { username };
        
        if (req.file) {
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ 
            success: true, 
            username: user.username, 
            avatarUrl: user.profilePicture 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/users/:id', upload.single('avatar'), async (req, res) => {
    try {
        const updatedData = { username: req.body.username };
        if (req.file) {
            updatedData.avatar = `/uploads/${req.file.filename}`;
        }
        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Logout route
app.post('/api/logout', (req, res) => {
    // In a stateless JWT setup, you typically don't need server-side logout
    // The client should discard the token
    res.json({ success: true, message: 'Logged out successfully' });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

        req.userId = decoded.id;
        next();
    });
}

// Calendar
// Create
app.post('/', async (req, res) => {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Read
app.get('/', async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Update
app.put('/:id', async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Delete
app.delete('/:id', async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Routes
app.use('/tasks', tasksRoutes);
app.use('/notes', noteRoutes);
app.use('/todolists', toDoListRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
