import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaUtensils, FaStar, FaDollarSign, FaToggleOn, FaToggleOff } from "react-icons/fa";
import "./Menu.css";
import { toast } from "react-toastify";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    status: "In Stock",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
        params: { populateCategory: 'true' }
      });
      
      // If no products exist, add some sample data for testing
      if (!response.data.products || response.data.products.length === 0) {
        const sampleProducts = [
          {
            _id: "1",
            name: "Margherita Pizza",
            description: "Classic tomato sauce with mozzarella cheese and fresh basil",
            price: 299,
            category: { _id: "cat1", name: "Pizza" },
            subcategory: { _id: "sub1", name: "Italian" },
            stock: 25,
            status: "In Stock",
            isPremium: true,
            image: "/uploads/1750414345798-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "2",
            name: "Chicken Burger",
            description: "Grilled chicken patty with fresh vegetables and special sauce",
            price: 199,
            category: { _id: "cat2", name: "Burgers" },
            subcategory: { _id: "sub2", name: "Fast Food" },
            stock: 8,
            status: "Low Stock",
            isPremium: false,
            image: "/uploads/1750414304630-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "3",
            name: "Pasta Carbonara",
            description: "Creamy pasta with bacon, parmesan cheese and black pepper",
            price: 249,
            category: { _id: "cat3", name: "Pasta" },
            subcategory: { _id: "sub3", name: "Italian" },
            stock: 0,
            status: "Out of Stock",
            isPremium: true,
            image: "/uploads/1750414265921-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "4",
            name: "Caesar Salad",
            description: "Fresh lettuce with caesar dressing, croutons and parmesan",
            price: 149,
            category: { _id: "cat4", name: "Salads" },
            subcategory: { _id: "sub4", name: "Healthy" },
            stock: 15,
            status: "In Stock",
            isPremium: false,
            image: "/uploads/1750413786660-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "5",
            name: "Chocolate Cake",
            description: "Rich chocolate cake with cream filling and chocolate ganache",
            price: 99,
            category: { _id: "cat5", name: "Desserts" },
            subcategory: { _id: "sub5", name: "Cakes" },
            stock: 12,
            status: "In Stock",
            isPremium: true,
            image: "/uploads/1750413746728-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "6",
            name: "Chicken Wings",
            description: "Crispy fried chicken wings with hot sauce and blue cheese dip",
            price: 179,
            category: { _id: "cat6", name: "Appetizers" },
            subcategory: { _id: "sub6", name: "Fried" },
            stock: 3,
            status: "Low Stock",
            isPremium: false,
            image: "/uploads/1750413722019-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "7",
            name: "Fish & Chips",
            description: "Beer-battered cod with crispy fries and tartar sauce",
            price: 229,
            category: { _id: "cat7", name: "Seafood" },
            subcategory: { _id: "sub7", name: "British" },
            stock: 0,
            status: "Out of Stock",
            isPremium: false,
            image: "/uploads/1750413661489-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "8",
            name: "Vegetable Curry",
            description: "Mixed vegetables in aromatic curry sauce with rice",
            price: 159,
            category: { _id: "cat8", name: "Indian" },
            subcategory: { _id: "sub8", name: "Vegetarian" },
            stock: 20,
            status: "In Stock",
            isPremium: true,
            image: "/uploads/1750413635344-261970_blsyac.png",
            seller: "seller1",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setProducts(sampleProducts);
      } else {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const productData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          productData.append(key, formData[key]);
        }
      }

      if (currentProduct) {
        await axios.put(`/api/products/${currentProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post("/api/products/add", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created successfully!");
      }
      fetchProducts();
      setShowModal(false);
      setCurrentProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        status: "In Stock",
        image: null,
      });
    } catch (error) {
      toast.error("Error saving product.");
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category?._id || product.category || "",
      subcategory: product.subcategory?._id || product.subcategory || "",
      stock: product.stock || "",
      status: product.status || "In Stock",
      image: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting product.");
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleToggleStatus = async (product, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const updatedProduct = { ...product, status: newStatus };
      
      await axios.put(`/api/products/${product._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(prod => 
          prod._id === product._id ? { ...prod, status: newStatus } : prod
        )
      );
      
      toast.success(`Product status updated to ${newStatus}!`);
    } catch (error) {
      toast.error(`Error updating product status`);
      console.error(`Error updating product status:`, error);
    }
  };

  const handleTogglePremium = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const updatedProduct = { ...product, isPremium: !product.isPremium };
      
      await axios.put(`/api/products/${product._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(prod => 
          prod._id === product._id ? { ...prod, isPremium: !prod.isPremium } : prod
        )
      );
      
      toast.success(`Product ${!product.isPremium ? 'marked as premium' : 'removed from premium'}!`);
    } catch (error) {
      toast.error(`Error updating premium status`);
      console.error(`Error updating premium status:`, error);
    }
  };

  // Calculate statistics with null checks
  const totalProducts = products?.length || 0;
  const premiumProducts = products?.filter(product => product?.isPremium)?.length || 0;
  const lowStockProducts = products?.filter(product => product?.status === 'Low Stock')?.length || 0;
  const outOfStockProducts = products?.filter(product => product?.status === 'Out of Stock')?.length || 0;
  const totalValue = products?.reduce((sum, product) => sum + (parseFloat(product?.price) || 0), 0) || 0;

  // Filter products with null checks
  const filteredProducts = products?.filter(product => {
    if (!product) return false;
    const matchesSearch = (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || 
                           (product.category?.name === categoryFilter) || 
                           (typeof product.category === 'string' && product.category === categoryFilter);
    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories with null checks
  const categories = [...new Set(products?.map(product => 
    product?.category?.name || (typeof product?.category === 'string' ? product?.category : null)
  ).filter(Boolean) || [])];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">⏳</div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-menu">
      <div className="admin-header">
        <h1>Product Management</h1>
        <p className="admin-subtitle">Manage your restaurant products and inventory</p>
      </div>

      <div className="menu-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUtensils />
          </div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-details">
            <h3>No. of Categories</h3>
            <p>{categories.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-details">
            <h3>Premium Products</h3>
            <p>{premiumProducts}</p>
          </div>
        </div>
      </div>

      <div className="menu-controls">
        <div className="search-box">
          <FaEye className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="menu-table-container">
        <div className="table-header">
          <h2>Products</h2>
        </div>

        <div className="table-responsive">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-items">
                    {searchTerm || categoryFilter ? "No products match your filters" : "No products found"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.image && (
                        <img
                          src={product.image.startsWith('/') ? product.image : `/uploads/${product.image}`}
                          alt={product.name || "Product"}
                          className="menu-item-image"
                        />
                      )}
                    </td>
                    <td>{product.name || "N/A"}</td>
                    <td className="description-cell">{product.description || "No description"}</td>
                    <td>₹{product.price || 0}</td>
                    <td>{product.category?.name || product.category || "Uncategorized"}</td>
                    <td>{product.stock || 0}</td>
                    <td>
                      <span className={`status-badge ${product.status === 'In Stock' ? 'active' : product.status === 'Low Stock' ? 'warning' : 'inactive'}`}>
                        {product.status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className={`action-btn ${product.isPremium ? 'premium' : 'regular'}`}
                          onClick={() => handleTogglePremium(product)} 
                          title={product.isPremium ? "Remove from Premium" : "Mark as Premium"}
                        >
                          {product.isPremium ? <FaStar /> : <FaStar />}
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subcategory:</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required={!currentProduct}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
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

export default Menu;