const express = require("express");
const { adminAuthorization } = require("../middleware/authorize");
const {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
} = require("../controllers/users.controller");

const router = express.Router();

router.post("/user", adminAuthorization, createUser);
router.put("/user/:id", adminAuthorization, updateUser);
router.delete("/user/:id", adminAuthorization, deleteUser);
router.get("/user/:id", adminAuthorization, getUserById);
router.get("/users", adminAuthorization, getUsers);

module.exports = router;
