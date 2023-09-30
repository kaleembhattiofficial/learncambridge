////////////////////
// Global
////////////////////

const mongoose = require('mongoose');

////////////////////
// Components
////////////////////

////////////////////
// Body
////////////////////

const { Schema } = mongoose;

const topicSchema = new Schema({
  // Automatic
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastEditedAt: {
    type: Date,
    default: Date.now(),
  },

  // Manual
  title: {
    type: String,
    required: [true, '{PATH} is required'],
  },
  // Excluding title
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, '{PATH} is required'],
  },

  status: {
    type: String,
    enum: {
      values: ['Good', 'Pending', 'Bad', 'Depricated'],
      message: 'Enum validator failed for path `{PATH}` with value `{VALUE}',
    },
    default: 'Pending',
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required'],
  },

  //...
  questions: {
    type: [Schema.Types.ObjectId],
    ref: 'Question',
    default: [],
  },

  resources: {
    type: [Schema.Types.ObjectId],
    ref: 'Resource',
    default: [],
  },

  qna: {
    type: [Schema.Types.ObjectId],
    ref: 'Qna',
    default: [],
  },

  notes: {
    type: [Schema.Types.ObjectId],
    ref: 'Note',
    default: [],
  },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
