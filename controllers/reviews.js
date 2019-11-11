const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

//@desc         Get all courses and a spesific bootcamp courses
//@route        GET /api/v1/reviews
//@route        GET /api/v1/bootcamps/:bootcampId/reviews
//@route        GET /api/v1/users/:userId/reviews
//@access       Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // Check if there there is a bootcampId and build query

  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
    //   } else if (
    //     req.params.userId &&
    //     (req.user.id === req.params.userId || req.user.role === 'admin')
    //   ) {
    //     reviews = await Review.find({ user: req.params.userId }).populate({
    //       path: 'bootcamp',
    //       select: 'name'
    //     });
    //     return res.status(200).json({
    //       success: true,
    //       count: reviews.length,
    //       data: reviews
    //     });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc         Get single review
//@route        GET /api/v1/reviews/:id
//@access       Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp user',
    select: 'name description'
  });
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});

//@desc         Create review
//@route        POST /api/v1/bootcamps/:bootcampId/reviews
//@access       Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}!`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});

//@desc         Update review
//@route        PUT /api/v1/reviews/:id
//@access       Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to update Review with id ${review.id}!`,
        404
      )
    );
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

//@desc         Delete a review
//@route        DELETE /api/v1/reviews/:id
//@access       Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`review not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to delete Review with id ${review.id}!`,
        404
      )
    );
  }

  await review.remove();
  res.status(200).json({ success: true, data: {} });
});
