import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'client',
    names: '',
    shopownerName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/auth/register', formData);
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <FaStore className="register-icon" />
          <h2>Create Account</h2>
          <p>Please fill in your information to register</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <div className="input-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input role-select"
              >
                <option value="client">Client</option>
                <option value="shopowner">Shop Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {formData.role === 'client' || formData.role === 'admin' ? (
            <div className="form-group">
              <div className="input-group">
                <input
                  type="text"
                  name="names"
                  placeholder="Full Name"
                  value={formData.names}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <div className="input-group">
                <input
                  type="text"
                  name="shopownerName"
                  placeholder="Shop Owner Name"
                  value={formData.shopownerName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-group">
              {/* <FaEnvelope className="input-icon" /> */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              {/* <FaLock className="input-icon" /> */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                minLength="6"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              {/* <FaPhone className="input-icon" /> */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              {/* <FaMapMarkerAlt className="input-icon" /> */}
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;