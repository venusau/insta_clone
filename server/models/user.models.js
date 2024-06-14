const mongoose = require("mongoose");
const { USER_CREATION_VARIABLE } = require("../utils/constants");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: [true, "username should be unique"],
    minLength: USER_CREATION_VARIABLE.USER_NAME_MIN_CHAR,
    maxLength: USER_CREATION_VARIABLE.USER_NAME_MAX_CHAR,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email should be unique"],
  },
  password: {
    type: String,
    required: true,
  },

  profilePicUrl: {
    type: String,
    required:true
  },
});

mongoose.model("User", userSchema);
