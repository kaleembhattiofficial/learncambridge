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

router
  .route(":id")
  .get(controller.getById)
  .delete(controller.deleteById)
  .patch(controller.patchById);

router.route("/search/:query").get(controller.search);

router.route("/new").post(authenticateToken, controller.postNew);

// DEV ONLY
router.route("/createDev").get(controller.createDev);

router.route("/all").get(async (req, res) => {
  const allQuestions = await Model.find({});
  res.json({ allQuestions });
});

module.exports = router;
