////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

const Model = require("./model");
const localErrorObj = require("./../utils/localErrorObj");

////////////////////
// Body
////////////////////

// GET
module.exports.getById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;

    // DB
    const subject = await Model.findOne({
      _id: params.id,
      status: 'Good',
    })
      .populate('author', 'username profile')
      .populate('contributors', 'username profile')
      .populate('topics');

    // Error handling
    if (!subject) return next(localErrorObj.noId);

    // Success
    res.status(200).json({
      status: 'success',
      data: subject,
      more: [],
    });
    next();
  } catch (error) {
    // Error handling
    next(error);
  }
};

module.exports.search = (req, res, next) => {};

// POST
module.exports.postNew = async (req, res, next) => {
  try {
    // Initialization
    const subject = {
      cambridgeLevel: req.body.cambridgeLevel.toUpperCase() || '',
      cambridgeSubject: req.body.cambridgeSubject.toUpperCase() || '',
      difficulty: req.body.difficulty || '',
      thumbnail: req.body.thumbnail || '',
      author: req.user,

      // Will be changed in the Schema
      cambridgeCombination: 'ANYTHING',
    };

    // New
    const newSubject = new Model(subject);

    // DB
    newSubject
      .save()
      .then((data) => {
        // Success
        res.status(200).json({
          status: 'success',
          message: `Created new subject: ${data.cambridgeLevel}_${data.cambridgeSubject}`,
          more: data,
        });
      })
      .catch((err) => {
        // Error handling
        err.statusCode = 401;
        return next(err);
      });
  } catch (error) {
    // Error handling
    next(error);
  }
};

// PATCH
module.exports.patchById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;
    const updatedSubject = {};

    // DB
    const subject = await Model.findOne({ _id: params.id, author: req.user });

    // Error handling
    if (!subject) return next(localErrorObj.noPermissions);

    // All edit options available
    if (req.body.contentCompletion) updatedSubject.contentCompletion = req.body.contentCompletion;

    if (req.body.status) updatedSubject.status = req.body.status;

    if (req.body.difficulty) updatedSubject.difficulty = req.body.difficulty;

    if (req.body.thumbnail) updatedSubject.thumbnail = req.body.thumbnail;

    if (req.body.thumbnailExtention)
      updatedSubject.thumbnailExtention = req.body.thumbnailExtention;

    // Checking if the updated subject contains the same values as the original subject
    if (Object.keys(updatedSubject).length > 0) {
      // Loop1
      for (const key of Object.keys(updatedSubject)) {
        // Converting into upper case for ease
        if (subject[`${key}`].toUpperCase() === updatedSubject[key].toUpperCase()) {
          // Removing the keys with the same values
          delete updatedSubject[key];
        }
      }
    }

    // Checking if the updated object has any values
    if (Object.keys(updatedSubject).length === 0) return next(localErrorObj.noChangesMade);

    // Updating DB
    await Model.updateOne({ _id: params.id, author: req.user }, updatedSubject, {
      runValidators: true,
    })
      .then(() => {
        // Success
        res.status(200).json({
          status: 'success',
          message: `${subject.cambridgeCombination} has successfully been edited with the values that you provided`,
          data: updatedSubject,
        });
      })
      // Error handling
      .catch((err) => next(err));
  } catch (error) {
    // Error handling
    next(error);
  }
};

// DELETE
module.exports.deleteById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;

    // DB
    const subject = await Model.findOne({ _id: params.id, author: req.user });

    // Error handling
    if (!subject) return next(localErrorObj.noPermissions);

    // DB
    await Model.deleteOne({ _id: params.id, author: req.user })
      .then(() => {
        // Success
        res.status(204).json({
          status: 'success',
          message: 'Removed your subject',
          more: [
            'This document will no longer exist',
            'Everything else still exists, like questions, qna, etc.',
          ],
        });
      })
      // Error handling
      .catch((err) => next(err));
  } catch (error) {
    // Error handling
    next(error);
  }
};

// DEV ONLY
module.exports.createDev = async (req, res, next) => {
  try {
    const createDevData = [
      {
        cambridgeLevel: "A",
        cambridgeSubject: "MATH",
        cambridgeCombination: "A_MATH",
        difficulty: "Difficult",
        thumbnail: "thumbnail.jpg",
        author: req.user,
      },
      {
        cambridgeLevel: "A",
        cambridgeSubject: "IT",
        cambridgeCombination: "A_IT",
        difficulty: "Impossible",
        thumbnail: "thumbnail.jpg",
        author: req.user,
      },
      {
        cambridgeLevel: "O",
        cambridgeSubject: "MATH",
        cambridgeCombination: "O_MATH",
        difficulty: "Medium",
        thumbnail: "thumbnail.jpg",
        author: req.user,
      },
      {
        cambridgeLevel: "O",
        cambridgeSubject: "ICT",
        cambridgeCombination: "O_ICT",
        difficulty: "Difficult",
        thumbnail: "thumbnail.jpg",
        author: req.user,
      },
    ];

    await createDevData.map((sub) => {
      const newSub = new Model(sub);

      newSub.save().catch((err) => next(err));
    });
    res.status(200).json({
      status: "success",
      message: `CreateDev, created ${createDevData.length} documents`,
      data: createDevData,
    });
  } catch (error) {
    next(error);
  }
};
