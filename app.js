import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import db from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers.js';
import apiRoutes from './routes/api.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js'; // Import User model
import EvaluationResult from './models/EvaluationResult.js'; // Import EvaluationResult model

dotenv.config();

const app = express();

// Trust proxy for IP addresses (if behind reverse proxy)
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to your new Express + SQL backend!',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes); // Add user routes



// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database initialization
const initializeDatabase = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected successfully');
    
    await db.sync({ alter: true });
    console.log('✅ All models synchronized');

  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

initializeDatabase();

export default app;