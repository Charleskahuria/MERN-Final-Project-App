import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Enable JSON body parsing

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lost and Found System API is running successfully.'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ success: false, message: 'Server Configuration Error', error: err.message });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is actively running on http://localhost:${PORT}`);
});
