const mongoose = require("mongoose");
const isImageUrl = require("is-image-url");

const validator = (url) => isImageUrl(url);
const imageValidator = [validator, "Please enter a valid image URL!"];

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      maxLength: [
        30,
        "Book name should have max length of 30 characters only.",
      ],
      required: [true, "Book name is required"],
    },
    type: {
      type: String,
      enum: {
        values: [
          "classics",
          "autobiography",
          "school books",
          "novels",
          "test books",
          "fantasy",
          "memoir",
          "self-help books",
          "detective",
          "mystery",
          "action",
          "adventure",
          "comic Books",
          "fiction",
          "horror",
          "romance",
          "short stories",
          "thrillers",
          "cookbooks",
          "history",
          "poetry",
          "true crime",
        ],
        message:
          "Book genre type should be any one of 'Classics', 'Autobiography', 'School Books', 'Novels', 'Test Books', 'Fantasy', 'Memoir', 'Self-help Books', 'Detective', 'Mystery', 'Action', 'Adventure', 'Comic Books', 'Fiction', 'Horror', 'Romance', 'Short Stories', 'Thrillers', 'Cookbooks', 'History', 'Poetry' or 'True Crime'",
      },
      required: [true, "Book type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    photo: {
      type: String,
      required: [true, "Book photo is required"],
      validate: imageValidator,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    borrowers: {
      type: [{ type: Schema.Types.ObjectId, ref: process.env.USER_MODEL_NAME }],
      default: [],
    },
    rating: {
      type: Schema.Types.ObjectId,
      ref: process.env.RATING_MODEL_NAME,
    },
  },
  { timestamps: true }
);

const modelName = process.env.BOOK_MODEL_NAME;
module.exports = mongoose.model(modelName, bookSchema);
