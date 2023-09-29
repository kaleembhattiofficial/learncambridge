////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

const generateAccessToken = require("./../utils/generateAccessToken");

////////////////////
// Body
////////////////////

function generateNewAccessToken(req, res, next) {
  try {
    const accessToken = generateAccessToken({ user: req.user });

    // Success
    res.status(200).json({
      status: "success",
      message: "New accessToken",
      accessToken,
    });
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = generateNewAccessToken;
