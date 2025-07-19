// Load environment variables from .env file
require('dotenv').config();


const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mainRoutes = require('./routes/index');
const setupDatabase = require(process.cwd() + '/database.js');
setupDatabase();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
// Logging for development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsers for form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use the main router for all incoming requests
app.use('/', mainRoutes);

// Simple 404 Not Found middleware
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Server Error' });
});


// Start the server
app.listen(PORT, () => {
    console.log(`✨ Server is running on http://localhost:${PORT}`);
});