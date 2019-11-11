const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/User');

// Include other resourse routers
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// Re-route into other resourse routers
router.use('/:userId/reviews', reviewRouter);

router
  .route('/')
  .get(
    advancedResults(User, {
      path: 'reviews',
      select: 'title text'
    }),
    getUsers
  )
  .post(createUser);
router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;
