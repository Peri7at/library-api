/* this middleware is called after the user-authentication 
to verify that user is authorized to access some protected book endpoints */
const Book = require("../models/book");

module.exports = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    // check if book exists and if user is the owner of the book
    if (!book)
      throw new Error("unauthorized to modify requested book: book not found");
    else if (book.owner.toString() === req.user._id) {
      return next();
    }
    return res.status(401).json({
      message:
        "unauthorized to modify requested book: only book owner can modify",
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message ?? error,
    });
  }
};
