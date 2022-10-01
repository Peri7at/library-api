const express = require("express");
const authController = require("../controllers/auth");
const userAuthMiddleware = require("../middlewares/user-authentication");
const { userValidationRules, validate } = require("../middlewares/validators");

const router = express.Router();

// All the following routes are preceded by '/api/auth'.

// The following route is to login the user.
router.post("/signin", authController.signInUser);

// The following route is to register the user.
// Before registering the user, all the required inputs by the user will get validated by the validation middlewares.
router.post(
  "/signup",
  userValidationRules(),
  validate,
  authController.signUpUser
);

// The following route is to sign out the user.
router.get("/signout", authController.signOutUser);

// The following route is to update the user as an admin to be able to access the protected routes.
router.put("/update", userAuthMiddleware, authController.updateUser);

module.exports = router;
