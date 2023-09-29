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
  username: {
    type: String,
    minlength: [4, "{PATH} should have atleast 4 characters"],
    maxlength: [64, "{PATH} should have less than 64 characters"],
    required: [true, "{PATH} is required"],
    unique: [true, "{PATH} must be unique"],
  },
  password: {
    type: String,
    required: [true, "{PATH} is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
