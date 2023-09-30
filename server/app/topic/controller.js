////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

const Model = require('./model');
const Subject = require('./../subject/model');

const localErrorObj = require('./../utils/localErrorObj');

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
      title: req.body.title,
      subject: req.body.subject,
      topicNumber: req.body.topicNumber,
      author: req.user,
    };

    let isTopicRepeat = false;

    // New
    const newTopic = new Model(topic);

    // Check if the subject exists
    const subject = await Subject.findById(newTopic.subject).populate('topics');

    if (!subject) return next(localErrorObj.noSubject);

    subject.topics.map((topicObj) => {
      if (
        topicObj.title.toUpperCase() === topic.title.toUpperCase() &&
        Number(topicObj.topicNumber) === Number(topic.topicNumber)
      ) {
        isTopicRepeat = true;
        return next(localErrorObj.topicRepetition);
      }
    });

    if (isTopicRepeat === false) {
      // DB
      newTopic
        .save()
        .then(async (data) => {
          // Saving to the subject
          subject.topics = [...subject.topics, data._id];

          await subject
            .save()
            .then(() => {
              // Success
              res.status(200).json({
                status: 'success',
                message: `Created new topic: ${data.title} | IN | ${subject.cambridgeCombination}`,
                more: data,
              });
            })
            .catch((err) => next(err));
        })
        .catch((err) => {
          // Error handling
          err.statusCode = 401;
          return next(err);
        });
    }
  } catch (error) {
    // Error handling
    next(error);
  }
};

// PATCH
module.exports.patchById = async (req, res, next) => {
  console.log(1);
  try {
    // Initialization
    const params = req.params;
    const updatedTopic = {};

    // DB
    const topic = await Model.findOne({ _id: params.id, author: req.user });

    // Error handling
    if (!topic) return next(localErrorObj.noPermissions);

    // All edit options available
    if (req.body.title) updatedTopic.title = req.body.title;
    if (req.body.topicNumber) updatedTopic.topicNumber = req.body.topicNumber;
    if (req.body.status) updatedTopic.status = req.body.status;

    // Checking if the updated subject contains the same values as the original subject
    if (Object.keys(updatedTopic).length > 0) {
      // Loop1
      for (const key of Object.keys(updatedTopic)) {
        // Converting into upper case for ease
        if (topic[`${key}`].toUpperCase() === updatedTopic[key].toUpperCase()) {
          // Removing the keys with the same values
          delete updatedTopic[key];
        }
      }
    }

    // Checking if the updated object has any values
    if (Object.keys(updatedTopic).length === 0) return next(localErrorObj.noChangesMade);

    // Updating DB
    await Model.updateOne({ _id: params.id, author: req.user }, updatedTopic, {
      runValidators: true,
    })
      .then(() => {
        // Success
        res.status(200).json({
          status: 'success',
          message: `${topic.cambridgeCombination} has successfully been edited with the values that you provided`,
          data: updatedTopic,
        });
      })
      // Error handling
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

// DELETE
module.exports.deleteById = (req, res, next) => {};

// DEV ONLY
module.exports.createDev = (req, res, next) => {};
