import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.js';

// Public routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Private routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

router.get('/admin-only', authorize('admin', 'super_admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome admin!',
    data: { user: req.user },
  });
});

export default router;