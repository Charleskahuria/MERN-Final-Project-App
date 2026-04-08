import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Endpoints
router.route('/stats').get(protect, authorizeRoles('admin'), getDashboardStats);

export default router;
