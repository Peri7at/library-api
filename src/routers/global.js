const express = require("express");

const router = express.Router();

const bookController = require("../controllers/book");

// The following route is preceded by '/api/global'.
// The following route does not require any authentication or authorization, that is any visitor of the app can see all the books.
router.get("/all-books", bookController.getAllBooks);

module.exports = router;
