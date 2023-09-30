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

router
  .route(':id')
  .get(controller.getById)
  .patch(authenticateToken, controller.patchById)
  .delete(authenticateToken, controller.deleteById);

router.route('/search/:query').get(controller.search);

router.route('/new').post(authenticateToken, controller.postNew);

// DEV ONLY
router.route('/createDev').get(controller.createDev);

router.route('/all').get(async (req, res) => {
  const allTopics = await Model.find({});
  res.status(200).json({ allTopics });
});

module.exports = router;
