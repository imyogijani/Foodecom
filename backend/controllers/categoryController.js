import Category from "../models/categoryModel.js";
import slugify from "slugify";

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name, parent } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({ message: "Category already exists" });
    }
    const category = await new Category({
      name,
      slug: slugify(name),
      parent: parent || null,
    });

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (parentCategory) {
        parentCategory.children.push(category._id);
        await parentCategory.save();
      }
    }
    await category.save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating category",
    });
  }
};

// Get all categories
export const categoryController = async (req, res) => {
  try {
    const categories = await Category.find({ parent: null }).populate({
      path: "children",
      populate: { path: "children" },
    });
    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// Single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate(
      "parent"
    );
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

// Delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};

// Update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        parent: parent || null,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};
