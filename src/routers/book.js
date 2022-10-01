const express = require("express");
const userAuthMiddleware = require("../middlewares/user-authentication");
const adminAuthMiddleware = require("../middlewares/admin-authentication");

const router = express.Router();

const bookController = require("../controllers/book");

// All the following routes are preceded by '/api/books'.

// The following route is to access just available books in the library.
router.get("/available", userAuthMiddleware, bookController.getAvailableBooks);

// The following route is to access filtered books according to genre type.
router.get("/filter", userAuthMiddleware, bookController.getFilteredBooks);

// The following route is to access a single book with given id.
router.get("/:id", userAuthMiddleware, bookController.getSingleBook);

// The following route is for users with admin privileges, that is just admins can add a book to the database.
router.post("/admin", adminAuthMiddleware, bookController.addBook);

// The following route is to borrow a book with given id.
router.put("/borrow/:id", userAuthMiddleware, bookController.borrowBook);

// The following route is to return a book with given id.
router.put("/return/:id", userAuthMiddleware, bookController.returnBook);

// The following route is for users with admin privileges, that is just admins can update and delete a book.
router
  .route("/admin/:id")
  .put(adminAuthMiddleware, bookController.updateBook)
  .delete(adminAuthMiddleware, bookController.deleteBook);

// The following route is to rate a book with given book id and update it if it was already rated before.
router
  .route("/:bookid/rating")
  .post(userAuthMiddleware, bookController.rateBook)
  .put(userAuthMiddleware, bookController.updateBookRating);

module.exports = router;
