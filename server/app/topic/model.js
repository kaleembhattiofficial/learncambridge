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
  lastEdit: {
    type: Date,
    default: Date.now(),
  },

  // Manual
  title: {
    type: String,
    required: [true, '{PATH} is required'],
  },

  topicNumber: {
    type: Number,
    enum: {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20],
      message: 'Enum validator failed for path `{PATH}` with value `{VALUE}',
    },
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

topicSchema.pre('save', function () {
  // Last edited
  this.lastEdit = Date.now();

  // Title
  this.title = this.title.toUpperCase();
});

const Topic = mongoose.model('Topics', topicSchema);

module.exports = Topic;
