import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCalendarAlt, FaPercentage, FaTag, FaSpinner } from 'react-icons/fa';
import axios from '../../utils/axios';
import './SellerDeals.css';

const SellerDeals = () => {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};

export default SellerDeals;

