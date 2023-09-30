////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

const model = require('./model');

////////////////////
// Body
////////////////////

// GET
module.exports.getById = (req, res, next) => {};

module.exports.search = (req, res, next) => {};

// POST
module.exports.postNew = async (req, res, next) => {
  try {
    // Initialization
    const topic = {
      title: title,
      subject: subject,
      author: req.user,
    };
  } catch (error) {
    next(error);
  }
};

// PATCH
module.exports.patchById = (req, res, next) => {};

// DELETE
module.exports.deleteById = (req, res, next) => {};

// DEV ONLY
module.exports.createDev = (req, res, next) => {};
