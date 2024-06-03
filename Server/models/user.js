const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const bookSchema = require("./book");

const userSchema = new Schema(
  {
    username: {
      tyoe: String,
      required: true,
      unique: true,
    },
    email: {
      tyoe: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      tyoe: String,
      required: true,
    },
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
