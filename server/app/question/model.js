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

const questionSchema = new Schema({
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
  body: {
    type: [
      {
        style: {
          type: String,
          required: [true, '{PATH} is required'],
          enum: {
            values: ['Subheading', 'Paragraph'],
            message: 'Enum validator failed for path `{PATH}` with value `{VALUE}',
          },
        },
        content: { type: String, required: [true, '{PATH} is required'] },
      },
    ],
  },

  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, '{PATH} is required'],
  },

  difficulty: {
    type: Number,
    max: 10,
    min: 1,
    required: [true, '{PATH} is required'],
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required'],
  },

  status: {
    type: String,
    enum: {
      values: ['Good', 'Pending', 'Bad', 'Depricated'],
      message: 'Enum validator failed for path `{PATH}` with value `{VALUE}',
    },
    default: 'Good',
  },

  interactive: {
    type: Boolean,
    default: false,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
