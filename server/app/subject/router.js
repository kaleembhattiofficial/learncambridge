////////////////////
// Global
////////////////////

const express = require('express');

////////////////////
// Components
////////////////////

const controller = require('./controller');
const authenticateToken = require('./../utils/authenticateToken');
const Model = require('./model');

////////////////////
// Body
////////////////////

const router = express.Router();

// Routes

// Public
router.route('/search/:query').get(controller.search);
router.route('/all').get(controller.getAll);
router.route('/:id').get(controller.getById);

// User specific
router.route('/new').post(authenticateToken, controller.postNew);
router.route('/my/all').get(authenticateToken, controller.getAllMy);
router
  .route('/my/:id')
  .patch(authenticateToken, controller.patchById)
  .delete(authenticateToken, controller.deleteById);


module.exports = router;
