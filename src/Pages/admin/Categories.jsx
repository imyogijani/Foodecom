import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Categories.css'; // Assuming you'll create this CSS file

const Categories = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Dummy data for categories for frontend display
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electronics', subcategories: ['Phones', 'Laptops'] },
    { id: '2', name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
  ]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryName.trim() === '') {
      toast.error('Category name cannot be empty.');
      return;
    }
    const newCategory = { id: Date.now().toString(), name: categoryName, subcategories: [] };
    setCategories([...categories, newCategory]);
    setCategoryName('');
    toast.success(`Category '${categoryName}' added.`);
  };

  const handleAddSubCategory = (e) => {
    e.preventDefault();
    if (subCategoryName.trim() === '' || selectedCategory === '') {
      toast.error('Subcategory name and category selection cannot be empty.');
      return;
    }
    setCategories(categories.map(cat =>
      cat.id === selectedCategory
        ? { ...cat, subcategories: [...cat.subcategories, subCategoryName] }
        : cat
    ));
    setSubCategoryName('');
    setSelectedCategory('');
    toast.success(`Subcategory '${subCategoryName}' added to selected category.`);
  };

  return (
    <div className="categories-container">
      <h1>Manage Categories & Subcategories</h1>

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
          <button type="submit" className="btn btn-primary">Add Category</button>
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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subcategory Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">Add Subcategory</button>
        </form>
      </div>

      <div className="current-categories-section">
        <h2>Current Categories & Subcategories</h2>
        {categories.length === 0 ? (
          <p>No categories added yet.</p>
        ) : (
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat.id} className="category-item">
                <h3>{cat.name}</h3>
                {cat.subcategories.length > 0 ? (
                  <ul className="subcategory-list">
                    {cat.subcategories.map((sub, index) => (
                      <li key={index}>{sub}</li>
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