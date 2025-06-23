/* eslint-disable no-prototype-builtins */
import Category from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name, parent } = req.body;
    let image = "";
    if (req.file) {
      console.log('Category image upload:', req.file);
      image = `/uploads/categories/${req.file.filename}`;
    }
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
      image,
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

// Get subcategories
export const getSubcategoriesController = async (req, res) => {
  try {
    const { parentId } = req.params;
    const subcategories = await Category.find({ parent: parentId }).populate(
      "children"
    );
    res.status(200).send({
      success: true,
      message: "Subcategories retrieved successfully",
      subcategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting subcategories",
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
    const { name, parent } = req.body;
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (typeof parent !== 'undefined') {
      updateData.parent = parent;
    }
    let oldImagePath = null;
    if (req.file) {
      // Find the current category to get the old image path
      const currentCategory = await Category.findById(req.params.id);
      if (currentCategory && currentCategory.image) {
        oldImagePath = path.join(
          path.resolve(),
          'backend/public',
          currentCategory.image.startsWith('/') ? currentCategory.image : `/${currentCategory.image}`
        );
      }
      updateData.image = `/uploads/categories/${req.file.filename}`;
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    // Delete old image file if a new one was uploaded
    if (req.file && oldImagePath && fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (e) {
        // Ignore error
      }
    }
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating category",
      error,
    });
  }
};
