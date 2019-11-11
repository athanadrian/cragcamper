const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');

//@desc         Get all courses and a spesific bootcamp courses
//@route        GET /api/v1/courses
//@route        GET /api/v1/bootcamps/:bootcampId/courses
//@access       Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // Check if there there is a bootcampId and build query
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc         Get single course
//@route        GET /api/v1/courses/:id
//@access       Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

//@desc         Create a course
//@route        POST /api/v1/bootcamps/:bootcampId/courses
//@access       Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Get user and add it to req.body
  req.body.user = req.user.id;

  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    next(
      new ErrorResponse(`bootcamp not with id ${req.params.bootcampId}`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a Course to bootcamp ${req.params.bootcampId} or ${bootcamp._id}!`,
        404
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

//@desc         Update course
//@route        PUT /api/v1/courses/:id
//@access       Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to update Course with id ${course.id}!`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: course });
});

//@desc         Delete a course
//@route        DELETE /api/v1/courses/:id
//@access       Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to delete Course with id ${course.id}!`,
        404
      )
    );
  }

  course.remove();
  res.status(200).json({ success: true, data: {} });
});
