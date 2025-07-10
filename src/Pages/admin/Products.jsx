/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaStore,
  FaEdit,
  FaTrash,
  FaBox,
  FaShoppingBag,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import "./Products.css";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchShops();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, selectedBrand]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/category/get-category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "/api/admin/all-products?populateCategory=true&populateSubcategory=true";
      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
      if (selectedSubcategory) {
        url += `&subcategoryId=${selectedSubcategory}`;
      }
      if (selectedBrand) {
        url += `&brand=${selectedBrand}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL products? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("/api/admin/products/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("All products deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting all products");
      }
    }
  };

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/shops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(response.data.shops);
    } catch (error) {
      toast.error("Error fetching shops");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleModalDelete = async () => {
    if (!selectedProduct) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/products/${selectedProduct._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
        closeProductModal();
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  useEffect(() => {
    if (showProductModal && selectedProduct) {
      setEditStatus(selectedProduct.status || "");
      setEditStock(selectedProduct.stock);
      setEditPrice(selectedProduct.price);
    }
  }, [showProductModal, selectedProduct]);

  const handleModalUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/products/${selectedProduct._id}`,
        {
          status: editStatus,
          stock: Number(editStock) || 0,
          price: Number(editPrice) || 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product updated successfully");
      fetchProducts();
      closeProductModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesShop =
      selectedShop === "all" || product.seller._id === selectedShop; // Assuming product.seller is populated with shop details
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || (product.category && product.category._id === selectedCategory);
    const matchesSubcategory = selectedSubcategory === "" || (product.subcategory && product.subcategory._id === selectedSubcategory);
    const matchesBrand = selectedBrand === "" || (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());

    return matchesShop && matchesSearch && matchesCategory && matchesSubcategory && matchesBrand;
  });

  const getProductStats = () => {
    return {
      totalProducts: products.length,
      activeShops: shops.length,
      categories: new Set(products.map((p) => p.category)).size,
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    };
  };

  const stats = getProductStats();

  if (loading) {
    return (
      <div className="loading">
        <FaSpinner className="spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Products Management</h1>
        <p className="admin-subtitle">Manage all products across shops</p>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory(""); // Reset subcategory when category changes
              setSelectedBrand(""); // Reset brand when category changes
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="filter-group">
            <label htmlFor="subcategoryFilter">Filter by Subcategory:</label>
            <select
              id="subcategoryFilter"
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setSelectedBrand(""); // Reset brand when subcategory changes
              }}
            >
              <option value="">All Subcategories</option>
              {categories
                .find((cat) => cat._id === selectedCategory)
                ?.children.map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {(selectedCategory || selectedSubcategory) && (
          <div className="filter-group">
            <label htmlFor="brandFilter">Filter by Brand:</label>
            <select
              id="brandFilter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {selectedCategory &&
                categories
                  .find((cat) => cat._id === selectedCategory)
                  ?.brands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
              {selectedSubcategory &&
                categories
                  .find((cat) => cat._id === selectedCategory)
                  ?.children.find((subcat) => subcat._id === selectedSubcategory)
                  ?.brands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label htmlFor="shopFilter">Filter by Shop:</label>
          <select
            id="shopFilter"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="all">All Shops</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.shopName}
              </option>
            ))}
          </select>
        </div>
        <button
          className="delete-all-products-btn"
          onClick={handleDeleteAllProducts}
        >
          Delete All Products
        </button>
      </div>

      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaStore />
          </div>
          <div className="stat-details">
            <h3>Active Shops</h3>
            <p>{stats.activeShops}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingBag />
          </div>
          <div className="stat-details">
            <h3>Categories</h3>
            <p>{stats.categories}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-details">
            <h3>Total Stock</h3>
            <p>{stats.totalStock}</p>
          </div>
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Shop</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              let imageUrl = "";
              if (product.image) {
                if (product.image.startsWith("/uploads/products/")) {
                  imageUrl = `http://localhost:8080${product.image}`;
                } else if (product.image.startsWith("/uploads/")) {
                  imageUrl = `http://localhost:8080${product.image}`;
                } else {
                  imageUrl = `http://localhost:8080/uploads/products/${product.image}`;
                }
              }
              return (
                <tr
                  key={product._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(product)}
                >
                  <td>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/vite.svg";
                        }}
                      />
                    ) : null}
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <div className="shop-info">
                      <FaStore className="shop-icon" />
                      <span>{product.shopName}</span>
                    </div>
                  </td>
                  <td>
                    {product.category?.name}
                    {product.subcategory?.name &&
                      ` (${product.subcategory.name})`}
                  </td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status ${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="action-buttons"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="edit-btn product-action-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(product);
                        }}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn product-action-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product._id);
                        }}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showProductModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Product Details</h2>
              <button className="close-btn" onClick={closeProductModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <img
                className="product-modal-image"
                src={
                  selectedProduct.image &&
                  (selectedProduct.image.startsWith("/uploads")
                    ? `http://localhost:8080${selectedProduct.image}`
                    : `http://localhost:8080/uploads/products/${selectedProduct.image}`)
                }
                alt={selectedProduct.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/vite.svg";
                }}
              />
              <div className="product-modal-details">
                <h3>{selectedProduct.name}</h3>
                <p>{selectedProduct.description}</p>
                <div className="product-meta">
                  <b>Shop:</b> {selectedProduct.shopName}
                  <br />
                  <b>Category:</b> {selectedProduct.category?.name}
                  {selectedProduct.subcategory?.name &&
                    ` (${selectedProduct.subcategory.name})`}
                </div>
                <form
                  className="product-modal-form"
                  onSubmit={handleModalUpdate}
                >
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      required
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="submit"
                      className="product-modal-glass-btn product-modal-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? "Saving..." : "Update"}
                    </button>
                    <button
                      type="button"
                      className="product-modal-glass-btn product-modal-danger"
                      onClick={handleModalDelete}
                      disabled={editLoading}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="product-modal-glass-btn product-modal-secondary"
                      onClick={closeProductModal}
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
