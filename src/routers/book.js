const express = require("express");
const userAuthenticationMiddleware = require("../middlewares/user-authentication");
const bookAuthenticationMiddleware = require("../middlewares/book-authorization");

const router = express.Router();

const bookController = require("../controllers/book");

// GET route for /api/books/available
router.get("/available", bookController.getAvailableBooks);

// GET route for /api/books/filter
router.get("/filter", bookController.getFilteredBooks);

// POST route for /api/books
router.post("/", userAuthenticationMiddleware, bookController.addBook);

// PUT route for /api/books/borrow
router.put(
  "/borrow/:id",
  userAuthenticationMiddleware,
  bookController.borrowBook
);

// PUT route for /api/books/borrow
router.put(
  "/return/:id",
  userAuthenticationMiddleware,
  bookController.returnBook
);

// GET, PUT and DELETE routes for /api/books/:id
router
  .route("/:id")
  .get(bookController.getSingleBook)
  .put(
    userAuthenticationMiddleware,
    bookAuthenticationMiddleware,
    bookController.updateBook
  )
  .delete(
    userAuthenticationMiddleware,
    bookAuthenticationMiddleware,
    bookController.deleteBook
  );

// POST and PUT routes for /api/books/:id/rating
router
  .route("/:bookid/rating")
  .post(userAuthenticationMiddleware, bookController.rateBook)
  .put(userAuthenticationMiddleware, bookController.updateBookRating);

module.exports = router;
