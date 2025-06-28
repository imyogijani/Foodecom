import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCalendarAlt, FaPercentage, FaTag, FaSpinner } from 'react-icons/fa';
import axios from '../../utils/axios';
import './SellerDeals.css';

const SellerDeals = () => {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    productId: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    maxQuantity: '',
    termsAndConditions: ''
  });

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

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/deals/create', newDeal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        toast.success('Deal created and sent for approval');
        setShowCreateModal(false);
        setNewDeal({
          title: '',
          description: '',
          productId: '',
          discountPercentage: '',
          startDate: '',
          endDate: '',
          maxQuantity: '',
          termsAndConditions: ''
        });
        fetchDeals();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating deal');
      console.log(error);
    }
  };

  const handleEndDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to end this deal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`/api/deals/${dealId}/end`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Deal ended successfully');
        fetchDeals();
      } catch (error) {
        toast.error('Error ending deal');
        console.log(error);
      }
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/deals/${dealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Deal deleted successfully');
        fetchDeals();
      } catch (error) {
        toast.error('Error deleting deal');
        console.log(error);
      }
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
        <div>
          <h1>My Deals</h1>
          <p className="admin-subtitle">Create and manage your special offers</p>
        </div>
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
                      onClick={() => handleDeleteDeal(deal._id)}
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
            
            <form onSubmit={handleCreateDeal}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Deal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDeal.title}
                      onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                      required
                      placeholder="Enter deal title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Product *</label>
                    <select
                      className="form-control"
                      value={newDeal.productId}
                      onChange={(e) => setNewDeal({...newDeal, productId: e.target.value})}
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
                    value={newDeal.description}
                    onChange={(e) => setNewDeal({...newDeal, description: e.target.value})}
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
                      value={newDeal.discountPercentage}
                      onChange={(e) => setNewDeal({...newDeal, discountPercentage: e.target.value})}
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
                      value={newDeal.maxQuantity}
                      onChange={(e) => setNewDeal({...newDeal, maxQuantity: e.target.value})}
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
                      value={newDeal.startDate}
                      onChange={(e) => setNewDeal({...newDeal, startDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newDeal.endDate}
                      onChange={(e) => setNewDeal({...newDeal, endDate: e.target.value})}
                      required
                      min={newDeal.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Terms and Conditions (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newDeal.termsAndConditions}
                    onChange={(e) => setNewDeal({...newDeal, termsAndConditions: e.target.value})}
                    placeholder="Any special terms or conditions"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Create Deal
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
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

export default SellerDeals;

