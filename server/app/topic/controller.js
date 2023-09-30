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
module.exports.patchById = (req, res, next) => {};

// DELETE
module.exports.deleteById = (req, res, next) => {};

// DEV ONLY
module.exports.createDev = (req, res, next) => {};
