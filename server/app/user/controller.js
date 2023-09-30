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
module.exports.edit = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;
    const updatedUser = {};

    // DB
    const user = await Model.findOne({ _id: req.user });

    // Error handling
    if (!user) return next(localErrorObj.noPermissions);

    // All edit options available
    if (req.body.biography) updatedUser.biography = req.body.biography;
    if (req.body.emailSubscription) updatedUser.emailSubscription = req.body.emailSubscription;
    if (req.body.status) updatedUser.status = req.body.status;
    if (req.body.profile) updatedUser.profile = req.body.profile;
    if (req.body.profileExtension) updatedUser.profileExtension = req.body.profileExtension;

    // Checking if the updated subject contains the same values as the original subject
    if (Object.keys(updatedUser).length > 0) {
      // Loop1
      for (const key of Object.keys(updatedUser)) {
        // Converting into upper case for ease
        if (String(user[key]).toUpperCase() === String(updatedUser[key]).toUpperCase()) {
          // Removing the keys with the same values
          delete updatedUser[key];
        }
      }
    }

    // Checking if the updated object has any values
    if (Object.keys(updatedUser).length === 0) return next(localErrorObj.noChangesMade);

    // Updating DB
    await Model.updateOne({ _id: req.user }, updatedUser, {
      runValidators: true,
    })
      .then(() => {
        // Success
        res.status(200).json({
          status: 'success',
          message: `${user.username} has successfully been edited with the values that you provided`,
          data: updatedUser,
        });
      })
      // Error handling
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

// DEVELOPMENT
