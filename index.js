require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mainRoutes = require('./routes/index');
const setupDatabase = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', mainRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Server Error' });
});

// Function to start the server after database setup
const startServer = async () => {
    try {
        console.log('Setting up database...');
        await setupDatabase();

        app.listen(PORT, () => {
            console.log(`✨ Server is running and listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to setup database or start server:', err);
        process.exit(1);
    }
};

// Start the application
startServer();