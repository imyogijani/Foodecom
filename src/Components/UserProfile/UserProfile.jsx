import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import MaleUser from '../../images/MaleUser.png';

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/auth/current-user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      toast.error('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/v1/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/v1/auth/upload-avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          setFormData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
          toast.success('Avatar uploaded successfully');
        }
      } catch (error) {
        toast.error('Error uploading avatar');
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-modal loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="profile-modal">
      <div className="profile-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={formData.avatar || MaleUser} 
              alt={formData.name} 
              className="profile-avatar"
            />
            {isEditing && (
              <label className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
                <FaEdit />
              </label>
            )}
          </div>
          <h2>{formData.name}</h2>
          <p className="user-role">{user?.role || 'User'}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <FaUser className="field-icon" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="field-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Email Address"
            />
          </div>

          <div className="form-group">
            <FaPhone className="field-icon" />
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Phone Number"
            />
          </div>

          <div className="form-group">
            <FaMapMarkerAlt className="field-icon" />
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Delivery Address"
            />
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="submit" className="save-btn">
                  <FaSave /> Save Changes
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                >
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
