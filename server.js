const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tasktrack', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    profilePicture: { type: String }
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.userId = verified.id;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Routes
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    newUser.save()
        .then(user => res.status(201).json({ message: 'User created, please log in' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully', token });
});

// New route to check authentication
app.get('/api/check-auth', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.json({ authenticated: false });
        }
        res.json({ authenticated: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// New route to update profile
app.post('/api/update-profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, name, newPassword } = req.body;
        const user = await User.findById(req.userId);

        if (username) user.username = username;
        if (name) user.name = name;
        if (req.file) user.profilePicture = `/uploads/${req.file.filename}`;
        
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        const updatedUser = await User.findById(req.userId).select('-password');
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
});

// Logout route (optional, as JWT is stateless)
app.post('/api/logout', (req, res) => {
    // In a real-world scenario, you might want to invalidate the token on the client-side
    res.json({ success: true, message: 'Logged out successfully' });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));