import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { generateToken } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      workspace: {
        name: `${name}'s Workspace`,
      },
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log audit
    await AuditLog.create({
      user: { name: user.name, email: user.email, userId: user._id },
      action: 'User registered',
      module: 'Users',
      details: { method: 'Register' },
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log audit
    await AuditLog.create({
      user: { name: user.name, email: user.email, userId: user._id },
      action: 'User logged in',
      module: 'Users',
      details: {
        method: 'Login',
        rememberMe: rememberMe || false,
      },
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Log audit
    await AuditLog.create({
      user: { name: req.user.name, email: req.user.email, userId: req.user._id },
      action: 'User logged out',
      module: 'Users',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, companyDetails, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (companyDetails) {
      user.companyDetails = { ...user.companyDetails, ...companyDetails };
    }
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    // Log audit
    await AuditLog.create({
      user: { name: user.name, email: user.email, userId: user._id },
      action: 'Password changed',
      module: 'Users',
      details: { method: 'Password Change' },
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastLogin: user.lastLogin,
    preferences: user.preferences,
    companyDetails: user.companyDetails,
    workspace: user.workspace,
  };

  res.status(statusCode).json({
    success: true,
    token,
    data: userData,
  });
};