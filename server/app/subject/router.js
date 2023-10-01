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

router
  .route("/all")
  .get(async (req, res) => {
    const allSubjects = await Model.find({ status: 'Good' }).select(req.select);
    res.status(200).json({
      status: "success",
      length: allSubjects.length,
      data: allSubjects,
      more: [],
    });
  })
  .delete(async (req, res) => {
    await Model.deleteMany({});
    res.status(204).json({
      status: "success",
      message: "Removed all documents",
    });
  });

router
  .route("/:id")
  .get(controller.getById)
  .delete(authenticateToken, controller.deleteById)
  .patch(authenticateToken, controller.patchById);

module.exports = router;
