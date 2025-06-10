require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDB } = require('./src/config/db'); // Correctly import initializeDB

// Import Routers (to be created later)
// const authRoutes = require('./src/routes/authRoutes');
// const productRoutes = require('./src/routes/productRoutes');
// const orderRoutes = require('./src/routes/orderRoutes');
// const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the React frontend app
// This path should point to the 'dist' folder of the built frontend application.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Initialize Database
initializeDB().then(() => {
    console.log('Database initialized successfully.');

    // Start listening only after the database is confirmed to be initialized.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the application at http://localhost:${PORT}`);
    });

}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1); // Exit if DB initialization fails
});

// API Routes (to be uncommented and implemented later)
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// All other GET requests not handled by API routes should serve the React app
// This ensures that client-side routing in the React app works correctly.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Global Error Handler (basic example)
// This should be the last piece of middleware added.
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Avoid sending stack trace to client in production
  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
                  ? 'Internal Server Error' 
                  : err.message || 'Something broke!';
  res.status(statusCode).json({ 
    success: false, 
    error: message 
  });
});

// Note: app.listen is now moved inside the initializeDB().then() block
// to ensure the server doesn't start before the database is ready.
