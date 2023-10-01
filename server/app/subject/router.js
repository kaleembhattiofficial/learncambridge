////////////////////
// Global
////////////////////

const express = require("express");

////////////////////
// Components
////////////////////

const controller = require("./controller");
const authenticateToken = require("./../utils/authenticateToken");
const Model = require("./model");

////////////////////
// Body
////////////////////

const router = express.Router();

// Routes

router.route("/search/:query").get(controller.search);

router.route("/new").post(authenticateToken, controller.postNew);

router.route('/all').get(controller.getAll);

router
  .route("/:id")
  .get(controller.getById)
  .delete(authenticateToken, controller.deleteById)
  .patch(authenticateToken, controller.patchById);

module.exports = router;
