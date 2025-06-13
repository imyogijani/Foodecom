import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import usr from "../../images/MaleUser.png";
import ThemeToggle from "../../Components/ThemeToggle/ThemeToggle";
import { useTheme } from "../../ThemeContext";
import { 
  FaShoppingCart, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt, 
  FaSignInAlt,
  FaStore
} from "react-icons/fa";
import UserProfile from "../../Components/UserProfile/UserProfile";
import "./Navbar.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Menu", path: "/menu" },
  { name: "Special offers", path: "/Offer" },
  { name: "Restaurant", path: "/Restaurant" },
  { name: "Track order", path: "/TrackOrder" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          const userData = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <FaStore className="logo-icon" />
            <span>E-Mall World</span>
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-buttons">
            {isLoggedIn ? (
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
                      src={avatarError ? usr : (user?.avatar || usr)}
                      alt={user?.name || "User avatar"}
                      className="user-avatar"
                      onError={handleAvatarError}
                    />
                  </button>
                  {showUserMenu && (
                    <div className="user-menu animate-dropdown">
                      <div className="user-info">
                        <img
                          src={avatarError ? usr : (user?.avatar || usr)}
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
            <ThemeToggle />
          </div>
        </div>
      </nav>
      {showProfile && (
        <UserProfile user={user} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
