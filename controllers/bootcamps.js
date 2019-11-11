const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//@desc         Get all bootcamps
//@route        GET /api/v1/bootcamps
//@access       Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Getting the result
  res.status(200).json(res.advancedResults);
});

//@desc         Get single bootcamp
//@route        GET /api/v1/bootcamps/:id
//@access       Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate(
    'courses reviews'
  );
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc         Create a bootcamp
//@route        POST /api/v1/bootcamps
//@access       Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Get user and add it to req.body
  req.body.user = req.user.id;

  // Check for published user's bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== 'admin') {
    next(
      new ErrorResponse(
        `the user with the ID: ${req.user.id}, has already published a bootcamp. He must be an admin to publish more.`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc         Update bootcamp
//@route        PUT /api/v1/bootcamps/:id
//@access       Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to update Bootcamp with id ${req.params.id}!`,
        404
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc         Delete a bootcamp
//@route        DELETE /api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to delete Bootcamp with id ${req.params.id}!`,
        404
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

//@desc         Get bootcamps within a radius
//@route        GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access       Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  // Get zipcode & distance from params
  const { zipcode, distance } = req.params;

  // Get lng & lat from params
  //const { lng, lat, distance } = req.params;

  // Get lng/lat from geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Earth radius = 3,963 mi / 6,378 km

  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

//@desc         Upload bootcamp photo
//@route        PUT /api/v1/bootcamps/:id/photo
//@access       Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}!`, 404)
    );
  }

  // Make sure that the user is the owner or is an administrator
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You must be the owner or have admin rights to update Bootcamp with id ${req.params.id}!`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure the image is photo (jpg, png, gif,...)
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Upload a valid image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create a custom filename
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      new ErrorResponse(`Problem uploading file`, 500);
    }
  });

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    data: file.name
  });
  console.log(req.files.file);
});
