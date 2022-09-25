const express = require("express");

const adminAuthMiddleware = require("../middlewares/admin-authentication");

const router = express.Router();

const userController = require("../controllers/user");

// GET route for /api/admin/users
router.get("/", adminAuthMiddleware, userController.getAllUsers);

// GET, PUT, DELETE routes for /api/admin/users/:id
router
  .route("/:id")
  .get(adminAuthMiddleware, userController.getSingleUser)
  .put(adminAuthMiddleware, userController.updateUser)
  .delete(adminAuthMiddleware, userController.deleteUser);

module.exports = router;
