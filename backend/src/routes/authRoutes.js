const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  logout,
} = require('../controllers/authController');

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

module.exports = router;