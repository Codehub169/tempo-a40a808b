require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const initializeDB = require('./src/config/db');

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
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Initialize Database
initializeDB().then(() => {
    console.log('Database initialized successfully.');
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Global Error Handler (basic example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
