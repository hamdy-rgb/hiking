const Category = require("../models/category.modal");

const createCategory = async (request, response) => {
  try {
    const { name, description } = request.body;

    // Create the category document
    const category = new Category({
      name,
      description,
      createdAt: new Date(), // Automatically set to the current date
    });

    // Save the category to the database
    await category.save();

    return response.json({
      message: "Category created successfully",
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateCategory = async (request, response) => {
  try {
    const categoryId = request.params.id; // Assuming you pass the category ID in the URL
    const { name, description } = request.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true },
    );

    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }

    return response.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (request, response) => {
  try {
    const categoryId = request.params.id;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }

    return response.json({ message: "Category deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (request, response) => {
  try {
    const categoryId = request.params.id; // Assuming you pass the category ID in the URL

    const category = await Category.findById(categoryId);

    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }

    return response.json(category);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (request, response) => {
  try {
    const categories = await Category.find();
    return response.json({ categories, totalCount: categories.length });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
