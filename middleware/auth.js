const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure that token exists
  if (!token) {
    return next(new ErrorResponse('Not Authorized for this route.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not Authorized for this route.', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('role ', req.user.role);
      next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route.`,
          403
        )
      );
    }
    next();
  };
};
