const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc         Get all Users
//@route        Get /api/v1/users
//@access       Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc         Get single User
//@route        Get /api/v1/users/:id
//@access       Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("reviews");

  if (!user) {
    return next(
      new ErrorResponse(`User with Id ${req.params.id}, Not found`),
      400
    );
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Create User
//@route        POST /api/v1/users/
//@access       Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorResponse(`Something went wrong`), 500);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Update User Details
//@route        PUT /api/v1/users/:id
//@access       Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with Id ${req.params.id}, Not found`),
      400
    );
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc         Delete User
//@route        DELETE /api/v1/users/:id
//@access       Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with Id ${req.params.id}, Not found`),
      400
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
