const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    maxlength: 95,
  },
  password_hash: {
    type: String,
    required: [true, "Password is required"],
  },
  previouslyBorrowedBooks: {
    type: [{ type: Schema.Types.ObjectId, ref: process.env.BOOK_MODEL_NAME }],
    default: [],
  },
  currentlyBorrowedBooks: {
    type: [{ type: Schema.Types.ObjectId, ref: process.env.BOOK_MODEL_NAME }],
    default: [],
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
  acceptTerms: {
    type: Boolean,
  },
});

const modelName = process.env.USER_MODEL_NAME;
module.exports = mongoose.model(modelName, userSchema);
