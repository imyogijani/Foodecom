import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye, FaSpinner, FaCalendarAlt, FaPercentage, FaTag } from 'react-icons/fa';
import axios from '../../utils/axios';
import './AdminDeals.css';

const AdminDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchDeals();
  }, [filter]);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/deals/admin/all?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeals(response.data.deals);
    } catch (error) {
      toast.error('Error fetching deals');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeal = async (dealId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/deals/admin/${dealId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deal approved successfully');
      fetchDeals();
      setShowModal(false);
    } catch (error) {
      toast.error('Error approving deal');
      console.log(error);
    }
  };

  const handleRejectDeal = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/deals/admin/${selectedDeal._id}/reject`, {
        rejectionReason,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deal rejected successfully');
      fetchDeals();
      setRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      toast.error('Error rejecting deal');
      console.log(error);
    }
  };

  const openRejectModal = (deal) => {
    setSelectedDeal(deal);
    setRejectModal(true);
  };

  const openDealModal = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="admin-deals">
      <div className="admin-header">
        <h1>Deal Management</h1>
        <p className="admin-subtitle">Manage and approve seller deal requests</p>
      </div>

      <div className="deals-controls">
        <div className="filter-tabs">
          {['pending', 'approved', 'rejected', 'active', 'expired'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="no-deals">
          <p>No {filter} deals found</p>
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
                
                <div className="seller-info">
                  <strong>Seller:</strong> {deal.seller?.names}
                </div>
              </div>
              
              <div className="deal-actions">
                <button
                  className="btn btn-info"
                  onClick={() => openDealModal(deal)}
                >
                  <FaEye /> View Details
                </button>
                
                {deal.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleApproveDeal(deal._id)}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => openRejectModal(deal)}
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deal Details Modal */}
      {showModal && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content deal-modal">
            <div className="modal-header">
              <h2>Deal Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="deal-full-details">
                <div className="detail-row">
                  <label>Title:</label>
                  <span>{selectedDeal.title}</span>
                </div>
                
                <div className="detail-row">
                  <label>Description:</label>
                  <span>{selectedDeal.description}</span>
                </div>
                
                <div className="detail-row">
                  <label>Product:</label>
                  <span>{selectedDeal.product?.name}</span>
                </div>
                
                <div className="detail-row">
                  <label>Seller:</label>
                  <span>{selectedDeal.seller?.names} ({selectedDeal.seller?.email})</span>
                </div>
                
                <div className="detail-row">
                  <label>Original Price:</label>
                  <span>₹{selectedDeal.originalPrice}</span>
                </div>
                
                <div className="detail-row">
                  <label>Discount:</label>
                  <span>{selectedDeal.discountPercentage}%</span>
                </div>
                
                <div className="detail-row">
                  <label>Deal Price:</label>
                  <span className="highlight">₹{selectedDeal.dealPrice}</span>
                </div>
                
                <div className="detail-row">
                  <label>Duration:</label>
                  <span>{formatDate(selectedDeal.startDate)} to {formatDate(selectedDeal.endDate)}</span>
                </div>
                
                <div className="detail-row">
                  <label>Status:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedDeal.status) }}
                  >
                    {selectedDeal.status}
                  </span>
                </div>
                
                {selectedDeal.maxQuantity && (
                  <div className="detail-row">
                    <label>Max Quantity:</label>
                    <span>{selectedDeal.maxQuantity}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <label>Created:</label>
                  <span>{formatDate(selectedDeal.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {selectedDeal.status === 'pending' && (
              <div className="modal-actions">
                <button
                  className="btn btn-success"
                  onClick={() => handleApproveDeal(selectedDeal._id)}
                >
                  <FaCheck /> Approve Deal
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowModal(false);
                    openRejectModal(selectedDeal);
                  }}
                >
                  <FaTimes /> Reject Deal
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModal && (
        <div className="modal-overlay">
          <div className="modal-content reject-modal">
            <div className="modal-header">
              <h2>Reject Deal</h2>
              <button className="close-btn" onClick={() => setRejectModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <p>Please provide a reason for rejecting this deal:</p>
              <textarea
                className="form-control"
                rows="4"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </div>
            
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={handleRejectDeal}
                disabled={!rejectionReason.trim()}
              >
                <FaTimes /> Reject Deal
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setRejectModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeals;
