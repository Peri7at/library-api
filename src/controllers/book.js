const { ObjectId } = require("mongoose").Types;
const BookModel = require("../models/book");
const RatingModel = require("../models/rating");
const UserModel = require("../models/user");

module.exports = {
  getAllBooks: async (req, res) => {
    try {
      const books = await BookModel.find().populate("rating");
      if (books.length <= 0) throw new Error("No books found");
      res.json(books);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  getSingleBook: async (req, res) => {
    try {
      const BookId = req.params.id;
      if (String(new ObjectId(BookId)) !== BookId.toString())
        throw new Error("Requested book ID is not valid!");
      const book = await BookModel.findById(BookId).populate("rating");
      if (!book) throw new Error("There is no book with the provided ID!");
      res.json(book);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  getAvailableBooks: async (req, res) => {
    try {
      const availableBooks = await BookModel.find({
        isAvailable: true,
      }).populate("rating");
      if (availableBooks.length <= 0)
        throw new Error("There are no available books at the moment!");
      res.json(availableBooks);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  getFilteredBooks: async (req, res) => {
    try {
      const typeQuery = req.query.type;
      if (!typeQuery) throw new Error("Type query parameter is required!");
      const filteredBooks = await BookModel.find({
        type: typeQuery.toLowerCase(),
        isAvailable: true,
      }).populate("rating");
      if (filteredBooks.length <= 0)
        throw new Error(`There are no available books of type ${typeQuery}!`);
      res.json(filteredBooks);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  updateBook: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedBook) {
        throw new Error("The book with the specified ID was not found.");
      }
      res.json(updatedBook);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  addBook: async (req, res) => {
    try {
      await BookModel.create(req.body);
      res.status(201).json({ message: "Book created successfully." });
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  deleteBook: async (req, res) => {
    const { id } = req.params;
    try {
      const book = await BookModel.findByIdAndDelete(id);
      if (!book) {
        throw new Error("The book with the specified ID was not found.");
      }
      res.status(204).end();
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  borrowBook: async (req, res) => {
    try {
      const { id } = req.params;
      const borrowerId = req.user._id;

      const book = await BookModel.findById(id);
      const user = await UserModel.findById(borrowerId);

      if (!user) {
        throw new Error("The user with the specified ID was not found.");
      }

      if (!book) {
        throw new Error("The book with the specified ID was not found.");
      }

      if (!book.isAvailable)
        throw new Error("The book with the specified ID is not available.");

      if (user.currentlyBorrowedBooks.includes(book._id))
        throw new Error(
          "The book with the specified ID is already borrowed by you."
        );

      book.count -= 1;
      book.borrowers.push(borrowerId);
      if (book.count < 1) book.isAvailable = false;

      user.currentlyBorrowedBooks.push(book._id);

      await user.save();
      await book.save();
      res.json({ message: "Book borrowed successfully" });
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  returnBook: async (req, res) => {
    try {
      const { id } = req.params;
      const borrowerId = req.user._id;

      const book = await BookModel.findById(id);
      const user = await UserModel.findById(borrowerId);

      if (!user) {
        throw new Error("The user with the specified ID was not found.");
      }

      if (!book) {
        throw new Error("The book with the specified ID was not found.");
      }

      if (!user.currentlyBorrowedBooks.includes(id)) {
        throw new Error(
          "The book with the specified ID was not borrowed by you."
        );
      }

      book.count += 1;

      const indexOfBorrower = book.borrowers.indexOf(borrowerId);
      if (indexOfBorrower > -1) {
        book.borrowers.splice(indexOfBorrower, 1);

        const indexOfCurrentlyBorrowedBook =
          user.currentlyBorrowedBooks.indexOf(id);

        if (indexOfCurrentlyBorrowedBook > -1) {
          user.currentlyBorrowedBooks.splice(indexOfCurrentlyBorrowedBook, 1);
        }
      }

      if (book.count > 0) book.isAvailable = true;

      if (!user.previouslyBorrowedBooks.includes(book._id))
        user.previouslyBorrowedBooks.push(book._id);

      await user.save();
      await book.save();
      res.json({ message: "Book returned successfully" });
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  rateBook: async (req, res) => {
    const { bookid } = req.params;
    try {
      if (String(new ObjectId(bookid)) !== bookid.toString())
        throw new Error("Requested book ID is not valid!");
      const book = await BookModel.findById(bookid).populate("rating");
      if (!book) throw new Error("The book with the specified ID wasn't found");
      if (!book.rating) {
        const newRatingData = {
          book: bookid,
          raters: [
            {
              raterId: req.user._id,
              rating: req.body.rating,
            },
          ],
        };
        const newRating = await RatingModel.create(newRatingData);
        book.rating = newRating.id;
        await book.save();
        res.status(201).json(newRating);
      } else {
        const newRater = {
          raterId: req.user._id,
          rating: req.body.rating,
        };
        const rating = await RatingModel.findById(book.rating);
        const isRaterExisting = book.rating.raters.find(
          (rater) => rater.raterId.toString() === req.user._id.toString()
        );
        if (isRaterExisting) throw new Error("You had already rated this book");
        rating.raters.push(newRater);
        await rating.save();
        res.status(201).json(rating);
      }
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },

  updateBookRating: async (req, res) => {
    const { bookid } = req.params;
    try {
      if (String(new ObjectId(bookid)) !== bookid.toString())
        throw new Error("Requested book ID is not valid!");
      const book = await BookModel.findById(bookid).populate("rating");
      if (!book) throw new Error("The book with the specified ID wasn't found");
      const rating = await RatingModel.findById(book.rating);
      if (!rating) throw new Error("The book does not have any rating");
      const bookRaters = book.rating.raters;
      const indexOfRater = bookRaters.findIndex(
        (rater) => rater.raterId.toString() === req.user._id.toString()
      );
      if (indexOfRater > -1) {
        rating.raters[indexOfRater].rating = req.body.rating;
      } else {
        throw new Error("You do not have a rating to update");
      }
      await rating.save();
      await book.save();
      res.json(rating);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },
};
