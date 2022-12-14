const mongoose = require("mongoose");

const { Schema } = mongoose;

const raterSchema = new Schema({
  raterId: {
    type: Schema.Types.ObjectId,
    ref: process.env.USER_MODEL_NAME,
    required: [true, "Rater ID is required"],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, "Rating value is required"],
  },
});

const ratingSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: process.env.BOOK_MODEL_NAME,
    required: [true, "Book reference is required"],
  },
  raters: {
    type: [raterSchema],
    default: [],
  },
});

ratingSchema.set("toJSON", { virtuals: true });

ratingSchema.virtual("averageRating").get(function () {
  let sum = 0;
  this.raters.forEach((rater) => {
    sum += rater.rating;
  });
  return sum / this.raters.length;
});

const modelName = process.env.RATING_MODEL_NAME;
module.exports = mongoose.model(modelName, ratingSchema);
