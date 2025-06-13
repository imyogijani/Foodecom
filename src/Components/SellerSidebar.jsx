import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTheme } from "./../ThemeContext";
import { toast } from "react-toastify";
import "./SellerSidebar.css";

const sellerLinks = [
  { name: "Dashboard", path: "dashboard", icon: <FaHome /> },
  {
    name: "Products",
    path: "products",
    icon: <FaBox />,
    submenu: [
      { name: "All Products", path: "products/all" },
      { name: "Add New Product", path: "products/add" },
    ],
  },
  { name: "Orders", path: "orders", icon: <FaShoppingCart /> },
  { name: "Customers", path: "customers", icon: <FaUsers /> },
];

const SellerSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubmenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${theme}`}>
      <div className="admin-sidebar">
        <h2 className="admin-title">E-Mall Seller</h2>
        <nav>
          <ul className="admin-nav-list">
            {sellerLinks.map((link, index) => (
              <li key={link.path}>
                {link.submenu ? (
                  <>
                    <div
                      className={`admin-nav-link ${
                        location.pathname.includes(link.path) ? "active" : ""
                      }`}
                      onClick={() => toggleSubmenu(index)}
                    >
                      <span className="admin-nav-icon">{link.icon}</span>
                      <span className="admin-nav-text">{link.name}</span>
                      <span className="admin-nav-icon arrow-icon">
                        {expandedMenu === index ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </div>
                    {expandedMenu === index && (
                      <ul className="submenu">
                        {link.submenu.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              to={subItem.path}
                              className={`admin-nav-link ${
                                location.pathname.includes(subItem.path)
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <span className="admin-nav-text">
                                {subItem.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`admin-nav-link ${
                      location.pathname.includes(link.path) ? "active" : ""
                    }`}
                  >
                    <span className="admin-nav-icon">{link.icon}</span>
                    <span className="admin-nav-text">{link.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={
              theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"
            }
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
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

export default SellerSidebar;
