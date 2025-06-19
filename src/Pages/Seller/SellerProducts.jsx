import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import axios from "../../utils/axios";
import "../../App.css";
import "./SellerProducts.css";

const SellerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
                    <Link
                      to={`/seller/edit-product/${product._id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
