import express from 'express';
import UserController from '../controllers/userController.js';
import { getUserEvaluations } from '../controllers/evaluationController.js';

const router = express.Router();

// Handle Google login data
router.post('/auth/google', UserController.handleGoogleLogin);

// Get user's evaluation history
router.get('/:userId/evaluations', getUserEvaluations);

// Get user by ID
router.get('/:userId', UserController.getUserById);

// Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// Update user profile
router.put('/:userId', UserController.updateUser);

// Deactivate user
router.patch('/:userId/deactivate', UserController.deactivateUser);

export default router;
