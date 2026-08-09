import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  getDashboardAnalytics,
  getRevenueReport,
  getTrafficSources,
} from '../controllers/analyticsController.js';

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/revenue', getRevenueReport);
router.get('/traffic', getTrafficSources);

export default router;