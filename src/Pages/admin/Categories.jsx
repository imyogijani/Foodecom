import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Categories.css"; // Assuming you'll create this CSS file
import axios from "../../utils/axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialLoad = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/category/get-category");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]); // Ensure categories is always an array
        console.warn(
          "API response for categories was not an array:",
          response.data
        );
      }
    } catch (err) {
      setError(err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const { data } = await axios.post("/api/category", {
        name: categoryName,
      });
      setCategories([...categories, data]);
      setCategoryName("");
      toast.success(`Category '${categoryName}' added.`);
    } catch (err) {
      toast.error("Failed to add category.");
      console.error(err);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (subCategoryName.trim() === "" || selectedCategory === "") {
      toast.error("Subcategory name and category selection cannot be empty.");
      return;
    }
    try {
      const { data } = await axios.post(`/api/category/create-subcategory`, {
        name: subCategoryName,
        parent: selectedCategory,
      });

      setCategories(
        categories.map((cat) =>
          cat._id === selectedCategory
            ? { ...cat, children: [...cat.children, data] }
            : cat
        )
      );
      setSubCategoryName("");
      setSelectedCategory("");
      toast.success(
        `Subcategory '${subCategoryName}' added to selected category.`
      );
    } catch (err) {
      toast.error("Failed to add subcategory.");
      console.error(err);
    }
  };

  return (
    <div className="categories-container">
      <div className="admin-header">
        <h1>Categories Management</h1>
        <p className="admin-subtitle">
          Manage product categories and subcategories
        </p>
      </div>

      <div className="category-section">
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory} className="category-form">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            Add Category
          </button>
        </form>
      </div>

      <div className="subcategory-section">
        <h2>Add New Subcategory</h2>
        <form onSubmit={handleAddSubCategory} className="subcategory-form">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subcategory Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            Add Subcategory
          </button>
        </form>
      </div>

      <div className="current-categories-section">
        <h2>Current Categories & Subcategories</h2>
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : categories.length === 0 ? (
          <p>No categories added yet.</p>
        ) : (
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat._id} className="category-item">
                <h3>{cat.name}</h3>
                {cat.children && cat.children.length > 0 ? (
                  <ul className="subcategory-list">
                    {cat.children.map((sub) => (
                      <li key={sub._id}>{sub.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No subcategories for this category.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
