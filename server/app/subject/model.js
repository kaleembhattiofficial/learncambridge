////////////////////
// Global
////////////////////

const mongoose = require("mongoose");

////////////////////
// Components
////////////////////

////////////////////
// Body
////////////////////

const { Schema } = mongoose;

const subjectSchema = new Schema({
  // Automatic
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastEdit: {
    type: Date,
    default: Date.now(),
  },

  cambridgeCombination: {
    type: String,
    unique: [true, '{PATH} should be unique'],
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

  // Manual
  cambridgeLevel: {
    type: String,
    enum: {
      values: ['O', 'A'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    required: [true, '{PATH} is required'],
  },

  cambridgeSubject: {
    type: String,
    enum: {
      values: ['MATH', 'ENGLISH', 'IT', 'ICT'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    required: [true, '{PATH} is required'],
  },

  difficulty: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Difficult', 'Impossible'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    required: [true, '{PATH} is required'],
  },

  thumbnail: {
    type: String,
    minlength: [8, '{PATH} filename must be greater than 8 characters'],
    maxlength: [128, '{PATH} filename must be less than 128 characters'],
    default: '',
  },

  thumbnailExtention: {
    type: String,
    enum: {
      values: ['png', 'jpg', 'jpeg', 'svg'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'png',
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required'],
  },

  contributors: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },

  rating: {
    type: Number,
    min: [0, '{PATH} must be greater than 0'],
    max: [5, '{PATH} must be lesser than 5'],
    default: 0,
  },

  contentCompletion: {
    type: Number,
    min: [0, '{PATH} must be greater than 0'],
    max: [100, '{PATH} must be lesser than 100'],
    default: 0,
  },

  // ...
  topics: {
    type: [Schema.Types.ObjectId],
    ref: 'Topics',
    default: [],
  },
});

subjectSchema.pre('save', function () {
  // Last Edit
  this.lastEdit = Date.now();

  // Thumnail location
  const thumbnailLocal = this.thumbnail.split('/');

  this.thumbnail = thumbnailLocal[thumbnailLocal.length - 1];

  this.thumbnail = `${this.cambridgeLevel.toLowerCase()}/${this.cambridgeSubject.toLowerCase()}/${this.thumbnail.toLowerCase()}`;

  // Cambridge combination
  this.cambridgeCombination = `${this.cambridgeLevel.toUpperCase()}_${this.cambridgeSubject.toUpperCase()}`;
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
