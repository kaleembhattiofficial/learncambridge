////////////////////
// Global
////////////////////

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

////////////////////
// Components
////////////////////

const Model = require("./model");
const localErrorObj = require("./../utils/localErrorObj");
const generateAccessToken = require("./../utils/generateAccessToken");

////////////////////
// Body
////////////////////

// PRODUCTION
// POST
module.exports.join = async (req, res, next) => {
  try {
    // Success
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(String(req.body.password), salt);

    // Initialization
    const user = new Model({
      username: req.body.username,
      password: hashedPassword,
    });

    // Saving
    user
      .save()
      .then(async (data) => {
        const accessToken = generateAccessToken({ user: data._id });

        res.status(200).json({
          status: "success",
          message: "Saved user to the DB",
          accessToken,
        });
      })
      .catch((err) => {
        err.statusCode = 401;
        return next(err);
      });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    // Initialization
    const userObj = new Model({
      username: req.body.username,
      password: req.body.password,
    });

    await userObj
      .validate()
      .then(async () => {
        // Success
        const user = await Model.findOne({ username: req.body.username });

        // Error handling
        if (!user) return next(localErrorObj.noUserFound);

        if (await bcrypt.compare(req.body.password, user.password)) {
          const accessToken = generateAccessToken({ user: user._id });

          // Success
          res.status(200).json({
            status: "success",
            message: "Logged in",
            accessToken,
          });
        } else {
          // Fail
          res.status(401).json({
            status: "fail",
            message: "Could not login",
          });
        }
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

// PATCH
module.exports.edit = (req, res, next) => {
  console.log(req.user);
  res.end("EDIT");
};

// DEVELOPMENT
