import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  logout,
} from '../controllers/authController.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);

// Admin only routes (example)
router.get('/admin-only', authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome admin!',
    data: { user: req.user },
  });
});

export default router;