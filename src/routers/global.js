const express = require("express");

const router = express.Router();

const bookController = require("../controllers/book");

// The following route does not require any authentication or authorization, that is any visitor of the app can see all the books.
// GET route for /api/global/all-books
router.get("/all-books", bookController.getAllBooks);

module.exports = router;
