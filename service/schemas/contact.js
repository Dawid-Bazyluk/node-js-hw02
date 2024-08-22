const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contacts"],
    },
    email: {
      type: String,
      required: [true, "Set email for contacts"],
    },
    phone: {
      type: Number,
      required: [true, "Set phone number for contacts"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = mongoose.model("contacts", contact);

module.exports = Contact;
