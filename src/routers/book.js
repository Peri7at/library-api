const express = require("express");
const userAuthMiddleware = require("../middlewares/user-authentication");
const adminAuthMiddleware = require("../middlewares/admin-authentication");

const router = express.Router();

const bookController = require("../controllers/book");

// GET route for /api/books/available
router.get("/available", userAuthMiddleware, bookController.getAvailableBooks);

// GET route for /api/books/filter
router.get("/filter", userAuthMiddleware, bookController.getFilteredBooks);

// GET route for /api/books/:id
router.get("/:id", userAuthMiddleware, bookController.getSingleBook);

// POST route for /api/books/admin
router.post("/admin", adminAuthMiddleware, bookController.addBook);

// PUT route for /api/books/borrow
router.put("/borrow/:id", userAuthMiddleware, bookController.borrowBook);

// PUT route for /api/books/borrow
router.put("/return/:id", userAuthMiddleware, bookController.returnBook);

// PUT and DELETE routes for /api/books/admin/:id
router
  .route("/admin/:id")
  .put(adminAuthMiddleware, bookController.updateBook)
  .delete(adminAuthMiddleware, bookController.deleteBook);

// POST and PUT routes for /api/books/:id/rating
router
  .route("/:bookid/rating")
  .post(userAuthMiddleware, bookController.rateBook)
  .put(userAuthMiddleware, bookController.updateBookRating);

module.exports = router;
