const express = require('express');
const router = express.Router();

// This require statement must match the new filename 'horoscope.js'
const horoscopeController = require('../controllers/horoscope');

// Route to display the main form
router.get('/', horoscopeController.renderForm);

// Route to handle form submission and show results
router.post('/submit', horoscopeController.getPrediction);

// Route to view all submissions
router.get('/submissions', horoscopeController.viewSubmissions);

// Health check route for monitoring
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

module.exports = router;