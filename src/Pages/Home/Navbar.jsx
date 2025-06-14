import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Menu", path: "/menu" },
  { name: "Special Offers", path: "/Offer" },
  { name: "Restaurants", path: "/Restaurant" },
  { name: "Track Order", path: "/trackorder" },
];

export default function Navbar() {
  const location = useLocation();

  const isActiveLink = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
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
                          <p className="user-name">{user?.name || "User"}</p>
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
