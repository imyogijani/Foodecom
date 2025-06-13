import React, { useState, useEffect } from "react";
import { FaSearch, FaStore, FaEdit, FaTrash } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchShops();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/admin/all-products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/admin/shops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShops(response.data.shops);
    } catch (error) {
      toast.error('Error fetching shops');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/v1/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesShop = selectedShop === 'all' || product.shopId === selectedShop;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesShop && matchesSearch;
    });

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Products Management</h1>
        <p className="admin-subtitle">Manage all products across shops</p>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="shop-filter"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="all">All Shops</option>
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Shops</h3>
          <p>{shops.length}</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p>{new Set(products.map(p => p.category)).size}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <div className="shop-info">
                      <FaStore className="shop-icon" />
                      <span>{product.shopName}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status ${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProduct(product._id)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
