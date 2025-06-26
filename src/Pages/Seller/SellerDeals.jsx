import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCalendarAlt, FaPercentage, FaTag, FaSpinner } from 'react-icons/fa';
import axios from '../../utils/axios';
import './SellerDeals.css';

const initialDeals = [
  // Example initial data
  // { id: 1, title: '50% Off Pizza', description: 'Get 50% off on all pizzas!', discount: 50, status: 'pending' }
];

const SellerDeals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', description: '', discount: '', status: 'pending' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/deals/seller', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setDeals(response.data.deals);
      }
    } catch (error) {
      toast.error('Error fetching deals');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/products/seller-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error('Error fetching products');
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setDeals(deals.map(d => d.id === form.id ? { ...form, discount: Number(form.discount) } : d));
      setEditing(false);
    } else {
      setDeals([
        ...deals,
        { ...form, id: Date.now(), discount: Number(form.discount), status: 'pending' }
      ]);
    }
    setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
  };

  const handleEdit = (deal) => {
    setForm(deal);
    setEditing(true);
  };

  const handleDelete = (id) => {
    setDeals(deals.filter(d => d.id !== id));
    if (editing && form.id === id) {
      setEditing(false);
      setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'active': return '#007bff';
      case 'expired': return '#6c757d';
      case 'ended': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="seller-deals">
      <div className="admin-header">
        <h1>My Deals</h1>
        <p className="admin-subtitle">Create and manage your special offers</p>
        <button 
          className="add-deal-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus style={{ marginRight: '0.5rem' }} />
          Create New Deal
        </button>
      </div>

      {deals.length === 0 ? (
        <div className="no-deals">
          <p>No deals found. Create your first deal to get started!</p>
        </div>
      ) : (
        <div className="deals-grid">
          {deals.map((deal) => (
            <div key={deal._id} className="deal-card">
              <div className="deal-header">
                <h3 className="deal-title">{deal.title}</h3>
                <span 
                  className="deal-status"
                  style={{ backgroundColor: getStatusColor(deal.status) }}
                >
                  {deal.status}
                </span>
              </div>
              
              <div className="deal-content">
                <p className="deal-description">{deal.description}</p>
                
                <div className="deal-details">
                  <div className="detail-item">
                    <FaTag className="detail-icon" />
                    <span>Product: {deal.product?.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaPercentage className="detail-icon" />
                    <span>Discount: {deal.discountPercentage}%</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                  </div>
                  
                  <div className="price-info">
                    <span className="original-price">₹{deal.originalPrice}</span>
                    <span className="deal-price">₹{deal.dealPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="deal-actions">
                {deal.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(deal._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
                
                {(deal.status === 'approved' || deal.status === 'active') && (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEndDeal(deal._id)}
                  >
                    End Deal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content create-deal-modal">
            <div className="modal-header">
              <h2>Create New Deal</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Deal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter deal title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Product *</label>
                    <select
                      className="form-control"
                      name="productId"
                      value={form.productId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name} - ₹{product.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your deal"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Discount Percentage *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discountPercentage"
                      value={form.discountPercentage}
                      onChange={handleChange}
                      min="1"
                      max="90"
                      required
                      placeholder="e.g., 20"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Max Quantity (Optional)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxQuantity"
                      value={form.maxQuantity}
                      onChange={handleChange}
                      min="1"
                      placeholder="Limit quantity (optional)"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                      min={form.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Terms and Conditions (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="termsAndConditions"
                    value={form.termsAndConditions}
                    onChange={handleChange}
                    placeholder="Any special terms or conditions"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update' : 'Create'} Deal
                </button>
                {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: null, title: '', description: '', discountPercentage: '', startDate: '', endDate: '', maxQuantity: '', termsAndConditions: '', status: 'pending' }); }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDeals;

