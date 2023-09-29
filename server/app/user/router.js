////////////////////
// Global
////////////////////

const express = require("express");

////////////////////
// Components
////////////////////

const controller = require("./controller");
const authenticateToken = require("./../utils/authenticateToken");
const generateNewAccessToken = require("./../utils/generateNewAccessToken");

////////////////////
// Body
////////////////////

const router = express.Router();

// Routes

router.route("/join").post(controller.join);
router.route("/login").post(controller.login);

router.route("/edit").patch(authenticateToken, controller.edit);

router.route("/token").get(authenticateToken, generateNewAccessToken);

module.exports = router;
