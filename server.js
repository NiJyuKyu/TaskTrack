const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tasksRoutes = require('./routes/tasksRoutes'); // Updated path
const noteRoutes = require('./routes/noteRoutes'); // Added path
const toDoListRoutes = require('./routes/toDoListRoutes'); // Added path

const app = express();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = 'your_jwt_secret_key'; // You should use environment variables for secrets


// Database connection
mongoose.connect('mongodb://localhost:27017/tasktrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    profilePicture: { type: String }
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    newUser.save()
        .then(user => res.status(201).json({ message: 'User created, please log in' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Login Error:', error); // Log detailed error
        res.status(500).json({ message: 'Server error' });
    }
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

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id; // Store user ID in request object
        next(); // Proceed to the next middleware/route handler
    });
}

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/tasks', tasksRoutes);
app.use('/notes', noteRoutes); // Added route
app.use('/todolists', toDoListRoutes); // Added route

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
