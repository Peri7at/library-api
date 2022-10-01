const express = require("express");

const adminAuthMiddleware = require("../middlewares/admin-authentication");

const router = express.Router();

const userController = require("../controllers/user");

// All the following routes are preceded by '/api/admin/users'.
// All the following routes require admin privileges.

// The following route is to access the information of all the users.
router.get("/", adminAuthMiddleware, userController.getAllUsers);

// The following route is to access the information of one certain user, update and delete the user with the specified id.
router
  .route("/:id")
  .get(adminAuthMiddleware, userController.getSingleUser)
  .put(adminAuthMiddleware, userController.updateUser)
  .delete(adminAuthMiddleware, userController.deleteUser);

module.exports = router;
