const express = require("express");
const authController = require("../controllers/auth");
const userAuthMiddleware = require("../middlewares/user-authentication");
const { userValidationRules, validate } = require("../middlewares/validators");

const router = express.Router();

// POST route for /api/auth/signin
router.post("/signin", authController.signInUser);

// POST route for /api/auth/signup
router.post(
  "/signup",
  userValidationRules(),
  validate,
  authController.signUpUser
);

// GET route for /api/auth/signout
router.get("/signout", authController.signOutUser);

// PUT route for /api/auth/update
router.put("/update", userAuthMiddleware, authController.updateUser);

module.exports = router;
