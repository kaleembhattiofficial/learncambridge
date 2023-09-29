////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

const model = require("./model");

////////////////////
// Body
////////////////////

// GET
module.exports.getById = (req, res, next) => {};

module.exports.search = (req, res, next) => {};

// POST
module.exports.postNew = (req, res, next) => {
  console.log(req.user);
  try {
    // Initialization
    const question = {
      title: req.body.title || "",
      body: req.body.body,
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
