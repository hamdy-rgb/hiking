const express = require("express");
const { adminAuthorization } = require("../middleware/authorize");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
} = require("../controllers/category.controller");

const router = express.Router();

router.post("/category", adminAuthorization, createCategory);
router.put("/category/:id", adminAuthorization, updateCategory);
router.delete("/category/:id", adminAuthorization, deleteCategory);
router.get("/category/:id", adminAuthorization, getCategoryById);
router.get("/categories", getAllCategories);

module.exports = router;
