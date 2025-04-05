const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('views'));

// Database Connection
connectDB();

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/auth', authRoutes);

module.exports = app; // Exportamos la app
