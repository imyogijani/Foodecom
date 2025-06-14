import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaStore, FaShoppingCart, FaCog, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import "./Navbar.css";
import UserProfile from "../../Components/UserProfile/UserProfile";
import MaleUser from "../../images/MaleUser.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Menu", path: "/menu" },
  { name: "Special Offers", path: "/Offer" },
  { name: "Restaurants", path: "/Restaurant" },
  { name: "Track Order", path: "/trackorder" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/v1/auth/current-user');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const isActiveLink = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="nav-container">
          <Link to="/" className="custom-logo">
            <FaStore className="logo-icon" />
            <span className="logo-main">E-Mall</span>
            <span className="logo-uk">World</span>
          </Link>

          <div className="nav-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-pill-link ${isActiveLink(link.path) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            {localStorage.getItem('token') ? (
              <>
                <Link to="/cart" className="cart-button" title="Shopping Cart">
                  <FaShoppingCart />
                  <span className="cart-count">0</span>
                </Link>
                <div className="user-menu-container">
                  <button
                    className="profile-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    title={user?.name || "User profile"}
                  >
                    <img
                      src={avatarError ? MaleUser : (user?.avatar || MaleUser)}
                      alt={user?.name || "User avatar"}
                      className="user-avatar"
                      onError={handleAvatarError}
                    />
                  </button>
                  {showUserMenu && (
                    <div className="user-menu animate-dropdown">
                      <div className="user-info">
                        <img
                          src={avatarError ? MaleUser : (user?.avatar || MaleUser)}
                          alt={user?.name || "User avatar"}
                          className="menu-avatar"
                          onError={handleAvatarError}
                        />
                        <div className="user-details">
                          <p className="user-name">{user?.names || user?.shopownerName || "User"}</p>
                          <p className="user-email">{user?.email || "No email"}</p>
                        </div>
                      </div>
                      <div className="menu-divider"></div>
                      <button
                        className="menu-item"
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowProfile(true);
                        }}
                      >
                        <FaCog /> Profile Settings
                      </button>
                      <button className="menu-item logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="login-button">
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Navbar;
