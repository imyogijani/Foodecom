import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./Menu.css";
import { toast } from "react-toastify";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    isPremium: false,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/menu-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.data);
    } catch (error) {
      toast.error("Error fetching menu items");
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const itemData = new FormData();
      for (const key in formData) {
        itemData.append(key, formData[key]);
      }

      if (currentMenuItem) {
        await axios.put(`/api/admin/menu-items/${currentMenuItem._id}`, itemData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item updated successfully!");
      } else {
        await axios.post("/api/admin/menu-items", itemData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item created successfully!");
      }
      fetchMenuItems();
      setShowModal(false);
      setCurrentMenuItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
    } catch (error) {
      toast.error("Error saving menu item.");
      console.error("Error saving menu item:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentMenuItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null, // Image handling might need more logic for existing images
      isPremium: item.isPremium || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/menu-items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item deleted successfully!");
        fetchMenuItems();
      } catch (error) {
        toast.error("Error deleting menu item.");
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleAddClick = () => {
    setCurrentMenuItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      isPremium: false,
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Loading menu items...</div>;
  }

  return (
    <div className="admin-menu">
      <div className="admin-header">
        <h1>Menu Management</h1>
        <p className="admin-subtitle">Manage your restaurant menu items</p>
      </div>

      <div className="menu-stats">
        <div className="stat-card">
          <h3>Total Menu Items</h3>
          <p>{menuItems?.length || 0}</p>
        </div>
      </div>

      <div className="menu-table-container">
        <div className="table-header">
          <h2>Menu Items</h2>
          <button className="add-new-btn" onClick={handleAddClick}>
            <FaPlus /> Add New Item
          </button>
        </div>

        <table className="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(menuItems || []).map((item) => (
              <tr key={item._id}>
                <td>
                  {item.image && (
                    <img
                      src={`/uploads/${item.image}`}
                      alt={item.name}
                      className="menu-item-image"
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>₹{item.price}</td>
                <td>{item.category}</td>
                <td>{item.isPremium ? "Yes" : "No"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
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
                <label>Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required={!currentMenuItem} // Image is required only for new items
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  name="isPremium"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={handleInputChange}
                />
                <label htmlFor="isPremium">Premium Item</label>
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