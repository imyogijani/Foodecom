import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import "./Products.css"; // Reusing Products.css for basic styling

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [formData, setFormData] = useState({
    planName: "",
    monthlyPrice: "",
    includedFeatures: "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/api/subscriptions");
      setSubscriptions(response.data.subscriptions);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching subscriptions.");
      console.log(error);

      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSubscription) {
        // Update existing subscription
        await axios.put(
          `/api/subscriptions/${currentSubscription._id}`,
          formData
        );
        toast.success("Subscription updated successfully!");
      } else {
        // Create new subscription
        await axios.post("/api/subscriptions", formData);
        toast.success("Subscription created successfully!");
      }
      fetchSubscriptions();
      setShowModal(false);
      setCurrentSubscription(null);
      setFormData({
        planName: "",
        monthlyPrice: "",
        includedFeatures: "",
      });
    } catch (error) {
      toast.error("Error saving subscription.");
      console.log(error);
    }
  };

  const handleEdit = (subscription) => {
    setCurrentSubscription(subscription);
    setFormData({
      planName: subscription.planName,
      monthlyPrice: subscription.monthlyPrice,
      includedFeatures: subscription.includedFeatures.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        toast.success("Subscription deleted successfully!");
        fetchSubscriptions();
      } catch (error) {
        toast.error("Error deleting subscription.");
        console.log(error);
      }
    }
  };

  const handleAddClick = () => {
    setCurrentSubscription(null);
    setFormData({
      planName: "",
      monthlyPrice: "",
      includedFeatures: "",
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Loading subscriptions...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Subscriptions Management</h2>
        <button className="add-new-btn" onClick={handleAddClick}>
          <FaPlus /> Add New Subscription
        </button>
      </div>

      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Monthly Price</th>
              <th>Included Features</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id}>
                <td>{subscription.planName}</td>
                <td>${subscription.monthlyPrice}</td>
                <td>{subscription.includedFeatures.join(", ")}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(subscription)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(subscription._id)}
                  >
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
            <h3>
              {currentSubscription
                ? "Edit Subscription"
                : "Add New Subscription"}
            </h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Plan Name:</label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Price:</label>
                <input
                  type="number"
                  name="monthlyPrice"
                  value={formData.monthlyPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Included Features (comma-separated):</label>
                <input
                  type="text"
                  name="includedFeatures"
                  value={formData.includedFeatures}
                  onChange={handleInputChange}
                  required
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

export default Subscriptions;
