////////////////////
// Global
////////////////////

const mongoose = require("mongoose");
const { Schema } = mongoose;

////////////////////
// Components
////////////////////

////////////////////
// Body
////////////////////

const userSchema = new Schema({
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
  username: {
    type: String,
    minlength: [4, '{PATH} should have atleast 4 characters'],
    maxlength: [64, '{PATH} should have less than 64 characters'],
    required: [true, '{PATH} is required'],
    unique: [true, '{PATH} must be unique'],
  },
  password: {
    type: String,
    required: [true, '{PATH} is required'],
  },

  role: {
    type: String,
    enum: {
      values: ['User', 'Mod', 'Admin'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'User',
  },

  subscription: {
    type: String,
    enum: {
      values: ['Free', 'Solo', 'Team'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'Free',
  },

  profile: {
    type: String,
    minlength: [8, '{PATH} (filename) must be greater than 8 characters'],
    maxlength: [128, '{PATH} (filename) must be less than 128 characters'],
    default: 'defaultProfile',
  },

  profileExtension: {
    type: String,
    enum: {
      values: ['png', 'jpg', 'jpeg'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'png',
  },

  biography: {
    type: String,
    maxlength: [128, '{PATH} (filename) must be less than 128 characters'],
    default: '',
  },

  emailSubscription: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: {
      values: ['Good', 'Pending', 'Private', 'Depricated'],
      message: 'Enum validator failed for `{PATH}` with value `{VALUE}',
    },
    default: 'Pending',
  },
});

userSchema.pre('save', function () {
  // Last Edit
  this.lastEdit = Date.now();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
