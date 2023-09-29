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

  publicStatus: {
    type: String,
    enum: {
      values: ['Show', 'Hide', 'Deleted'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'Show',
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
    required: [true, '{PATH} is required'],
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required'],
  },

  contributors: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: [true, '{PATH} is required'],
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
    ref: 'note',
    default: [],
  },
});

subjectSchema.pre("save", function () {
  this.lastEdit = Date.now();

  this.thumbnail = `${this.cambridgeLevel.toLowerCase()}/${this.cambridgeSubject.toLowerCase()}/${this.thumbnail.toLowerCase()}`;

  this.cambridgeCombination = `${this.cambridgeLevel}_${this.cambridgeSubject}`;
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
