const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Include other resourse routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
// Send lng and lat from UI
// router.route('/radius/:lng/:lat/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(
    advancedResults(Bootcamp, {
      path: 'courses reviews',
      select: 'title description text'
    }),
    getBootcamps
  )
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
