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
  // Removed edit state variables as admin will only view and delete
  // const [editStatus, setEditStatus] = useState("");
  // const [editStock, setEditStock] = useState("");
  // const [editPrice, setEditPrice] = useState("");
  // const [editLoading, setEditLoading] = useState(false);
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



  // Removed handleModalUpdate as admin will only view and delete
  // const handleModalUpdate = async (e) => {
  //   e.preventDefault();
  //   if (!selectedProduct) return;
  //   setEditLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.put(
  //       `/api/admin/products/${selectedProduct._id}`,
  //       {
  //         status: editStatus,
  //         stock: Number(editStock) || 0,
  //         price: Number(editPrice) || 0,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     toast.success("Product updated successfully");
  //     fetchProducts();
  //     closeProductModal();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Error updating product");
  //   } finally {
  //     setEditLoading(false);
  //   }
  // };

  const filteredProducts = products.filter((product) => {
    const matchesShop =
      selectedShop === "all" || (product.seller && product.seller._id === selectedShop); // Assuming product.seller is populated with shop details
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

          <div className="products-grid-container">
            <div className="product-cards-container">
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
                  <div key={product._id} className="product-card">
                    <div className="product-card-header">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="product-card-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/vite.svg";
                          }}
                        />
                      ) : null}
                      <h3 className="product-card-name">{product.name}</h3>
                    </div>
                    <div className="product-card-body">
                      <p className="product-card-detail">
                        <strong>Category:</strong> {product.category?.name}
                        {product.subcategory?.name &&
                          ` (${product.subcategory.name})`}
                      </p>
                      <p className="product-card-detail">
                        <strong>Price:</strong> ₹{product.price.toFixed(2)}
                      </p>
                      <p className="product-card-detail">
                        <strong>Stock:</strong> {product.stock}
                      </p>
                      <p className="product-card-detail">
                        <strong>Status:</strong>
                        <span
                          className={`status ${product.status.toLowerCase()}`}
                        >
                          {product.status}
                        </span>
                      </p>
                      <p className="product-card-detail">
                        <strong>Shop:</strong>
                        <div className="shop-info">
                          <FaStore className="shop-icon" />
                          <span>{product.shopName}</span>
                        </div>
                      </p>
                    </div>
                    <div className="product-card-actions">
                      <button
                        className="view-product-btn"
                        onClick={() => handleRowClick(product)}
                      >
                        <FaEdit /> View Details
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

      {showProductModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Product Details</h2>
            {selectedProduct && (
              <div className="product-details-view">
                <div className="detail-group">
                  <strong>Product Name:</strong>
                  <span>{selectedProduct.name}</span>
                </div>
                <div className="detail-group">
                  <strong>Description:</strong>
                  <span>{selectedProduct.description}</span>
                </div>
                <div className="detail-group">
                  <strong>Category:</strong>
                  <span>{selectedProduct.category?.name || "N/A"}</span>
                </div>
                <div className="detail-group">
                  <strong>Price:</strong>
                  <span>₹{selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="detail-group">
                  <strong>Stock:</strong>
                  <span>{selectedProduct.stock}</span>
                </div>
                <div className="detail-group">
                  <strong>Status:</strong>
                  <span
                    className={`status ${selectedProduct.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
                <div className="detail-group">
                  <strong>Shop:</strong>
                  <span>{selectedProduct.seller?.shopName || "N/A"}</span>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={handleModalDelete}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete Product
                  </button>
                  <button type="button" onClick={closeProductModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
