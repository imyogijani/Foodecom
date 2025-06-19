/* eslint-disable no-prototype-builtins */
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
    const categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Remove from parent's children array if it has a parent
    if (categoryToDelete.parent) {
      const parentCategory = await Category.findById(categoryToDelete.parent);
      if (parentCategory) {
        parentCategory.children.pull(id);
        await parentCategory.save();
      }
    }

    // Recursively delete children categories
    const deleteChildren = async (categoryId) => {
      const children = await Category.find({ parent: categoryId });
      for (const child of children) {
        await deleteChildren(child._id);
        await Category.findByIdAndDelete(child._id);
      }
    };

    await deleteChildren(id);
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
    const { name } = req.body; // Only destructure name initially
    const newParentFromReq = req.body.parent; // Get parent explicitly from req.body
    const { id } = req.params;

    const oldCategory = await Category.findById(id);
    if (!oldCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    let actualNewParentId = oldCategory.parent; // Default to old parent

    // Determine the actual new parent ID
    if (req.body.hasOwnProperty("parent")) {
      // If parent is explicitly provided in req.body
      if (newParentFromReq === null || newParentFromReq === "") {
        actualNewParentId = null; // Explicitly setting to root
      } else {
        actualNewParentId = newParentFromReq; // New parent ID provided
      }
    }

    // Handle parent change in children arrays
    const oldParentId = oldCategory.parent
      ? oldCategory.parent.toString()
      : null;
    const currentNewParentId = actualNewParentId
      ? actualNewParentId.toString()
      : null;

    if (oldParentId !== currentNewParentId) {
      // Remove from old parent's children if old parent existed
      if (oldParentId) {
        const oldParentCategory = await Category.findById(oldParentId);
        if (oldParentCategory) {
          oldParentCategory.children.pull(id);
          await oldParentCategory.save();
        }
      }

      // Add to new parent's children if new parent exists
      if (currentNewParentId) {
        const newParentCategory = await Category.findById(currentNewParentId);
        if (newParentCategory) {
          newParentCategory.children.push(id);
          await newParentCategory.save();
        }
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        parent: actualNewParentId, // Use the determined actualNewParentId
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
