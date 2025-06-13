import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import { toast } from "react-toastify";
import "./AdminSidebar.css";

const adminLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
  { name: "Products", path: "/admin/products", icon: <FaBox /> },
  { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
  { name: "Users", path: "/admin/users", icon: <FaUsers /> },
];

const AdminSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${theme}`}>
      <div className="admin-sidebar">
        <h2 className="admin-title">E-Mall Admin</h2>
        <nav>
          <ul className="admin-nav-list">
            {adminLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`admin-nav-link ${
                    location.pathname.includes(link.path) ? "active" : ""
                  }`}
                >
                  <span className="admin-nav-icon">{link.icon}</span>
                  <span className="admin-nav-text">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
