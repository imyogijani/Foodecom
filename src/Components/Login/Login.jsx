import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Client'  // Default role with correct case
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const response = await axios.get('/api/v1/auth/verify-token');
          if (response.data.success) {
            redirectBasedOnRole(JSON.parse(user).role);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
  }, []);

  const redirectBasedOnRole = (role) => {
    switch(role.toLowerCase()) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'shopowner':
        navigate('/seller/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/v1/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Login successful! 🎉');
        redirectBasedOnRole(response.data.user.role);
      } else {
        const errorMsg = response.data.message || 'Login failed';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaUserCircle size={48} color="#007bff" />
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              {/* <FaEnvelope className="input-icon" /> */}
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              {/* <FaLock className="input-icon" /> */}
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="shopowner">Shop Owner</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="register-link">
          Don't have an account?
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;