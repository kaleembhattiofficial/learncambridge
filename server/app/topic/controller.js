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
module.exports.getAll = async (req, res, next) => {
  try {
    // Initialization
    const getAllSelect =
      '-lastEdit -createdAt -subject -status -author -questions -resources -qna -notes -__v';

    // DB
    const allTopics = await Model.find({ status: 'Good' })
      .select(getAllSelect)
      .limit(req.perPage)
      .skip(req.perPage * req.getPage);

    // Success
    res.status(200).json({
      status: 'success',
      itemsLength: allTopics.length,
      page: req.getPage + 1,
      data: allTopics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMy = async (req, res, next) => {
  try {
    // Initialization
    const getAllSelect = '-author -__v';

    // DB
    const allTopics = await Model.find({ author: req.user })
      .sort(req.sort)
      .select(getAllSelect)
      .limit(req.perPage)
      .skip(req.perPage * req.getPage);

    // Success
    res.status(200).json({
      status: 'success',
      itemsLength: allTopics.length,
      page: req.getPage + 1,
      data: allTopics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;
    const getByIdSelect = '-__v';

    // DB
    const topic = await Model.findOne({
      _id: params.id,
      status: 'Good',
    }).select(getByIdSelect);
    // .populate('questions')
    // .populate('resources')
    // .populate('qna')
    // .populate('notes');

    // Error handling
    if (!topic) return next(localErrorObj.noId);

    // Success
    res.status(200).json({
      status: 'success',
      itemsLength: 1,
      page: 1,
      data: topic,
    });
    next();
  } catch (error) {
    // Error handling
    next(error);
  }
};

module.exports.getMyById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;
    const getByIdSelect = '-__v';

    // DB
    const topic = await Model.findOne({
      _id: params.id,
      author: req.user,
    }).select(getByIdSelect);
    // .populate('questions')
    // .populate('resources')
    // .populate('qna')
    // .populate('notes');

    // Error handling
    if (!topic) return next(localErrorObj.noId);

    // Success
    res.status(200).json({
      status: 'success',
      itemsLength: 1,
      page: 1,
      data: topic,
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
    const topic = {
      title: req.body.title,
      topicNumber: req.body.topicNumber,
      subject: req.body.subject,
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
                data: { _id: data._id },
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
        if (String(topic[key]).toUpperCase() === String(updatedTopic[key]).toUpperCase()) {
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
      .then((data) => {
        // Success
        res.status(200).json({
          status: 'success',
          message: `${topic.title} has successfully been edited with the values that you provided`,
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
module.exports.deleteById = async (req, res, next) => {
  try {
    // Initialization
    const params = req.params;

    // DB
    const topic = await Model.findOne({ _id: params.id });

    // Error handling
    if (!topic) return next(localErrorObj.noId);

    if (topic.author != req.user) return next(localErrorObj.noPermissions);

    // DB
    await Model.deleteOne({ _id: params.id, author: req.user })
      .then(() => {
        // LATER: Change the status for all subdocuments
        // Success
        res.status(204).json({
          status: 'success',
          message: 'Removed your topic',
        });
      })
      // Error handling
      .catch((err) => {
        // Error handling
        err.statusCode = 400;
        return next(err);
      });
  } catch (error) {
    // Error handling
    next(error);
  }
};
