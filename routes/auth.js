const express = require('express');
const rateLimit = require('express-rate-limit');

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

const {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updateUserPassword
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/register', createAccountLimiter, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', protect, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-user-details', protect, updateUserDetails);
router.put('/update-user-password', protect, updateUserPassword);

module.exports = router;
