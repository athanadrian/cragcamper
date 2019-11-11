const express = require('express');

const {
  getCrags,
  getCrag,
  createCrag,
  updateCrag,
  deleteCrag
} = require('../controllers/Crags');

const router = express.Router();

router
  .route('/')
  .get(getCrags)
  .post(createCrag);

router
  .route('/:id')
  .get(getCrag)
  .put(updateCrag)
  .delete(deleteCrag);

module.exports = router;
