import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit } from "react-icons/fa";
import axios from "../../utils/axios";
import "../../App.css";
import "./SellerProducts.css";

const SellerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/category/get-category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/products/seller-products?populateCategory=true",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          toast.success("Product deleted successfully");
          fetchProducts();
        }
      } catch (error) {
        toast.error("Error deleting product");
        console.log(error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditCategory(product.category?._id || "");
    setEditStatus(product.status || "");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/products/${editProduct._id}`,
        {
          category: editCategory,
          status: editStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product updated successfully");
      closeEditModal();
      fetchProducts();
    } catch (error) {
      toast.error("Error updating product");
      console.log(error);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category.name === selectedCategory
        );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Products</h1>
        <p className="admin-subtitle">Manage your products and inventory</p>
        <Link to="/seller/products/add" className="add-product-btn">
          <FaPlus style={{ marginRight: "0.5rem" }} />
          Add New Product
        </Link>
      </div>

      <div className="category-filter">
        <button
          key="All"
          className={`category-btn ${
            selectedCategory === "All" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`category-btn ${
              selectedCategory === category.name ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="products-container">
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={`status ${product.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-icon-btn"
                      onClick={() => handleEdit(product)}
                      title="Edit Product"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={editProduct?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} required>
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={editProduct?.price || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={editProduct?.stock || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} required>
                  <option value="" disabled>Select status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
