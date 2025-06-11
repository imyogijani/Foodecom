import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Client',
    names: '',
    shopownerName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Client">Client</option>
            <option value="shopowner">Shop Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {formData.role === 'Client' || formData.role === 'admin' ? (
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="names"
              value={formData.names}
              onChange={handleChange}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Shop Owner Name:</label>
            <input
              type="text"
              name="shopownerName"
              value={formData.shopownerName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {formData.role !== 'admin' && (
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;