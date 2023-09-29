////////////////////
// Global
////////////////////

const jwt = require("jsonwebtoken");

////////////////////
// Components
////////////////////

const localErrorObj = require("./localErrorObj");

////////////////////
// Body
////////////////////

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return next(localErrorObj.noToken);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        err.statusCode = 403;
        return next(err);
      }

      req.user = data.user;
      return next();
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = authenticateToken;
