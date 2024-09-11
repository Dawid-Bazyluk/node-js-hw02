const mongoose = require("mongoose");
const { Schema } = mongoose;
const bCrypt = require("bcrypt");
const { verify } = require("jsonwebtoken");
const saltRounds = 10;

const user = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },

    verify: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false }
);

user.methods.setPassword = async function (myPassword) {
  this.password = await bCrypt.hash(myPassword, saltRounds);
};

user.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", user);

module.exports = User;
