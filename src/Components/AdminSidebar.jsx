import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaStore,
  FaUserCheck,
  FaTruck,
  FaCreditCard,
} from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import "./AdminSidebar.css";

const adminLinks = [
  { name: "Dashboard", path: "dashboard", icon: <FaHome /> },
  { name: "Products", path: "products", icon: <FaBox /> },
  { name: "Orders", path: "orders", icon: <FaShoppingCart /> },
  { name: "Users", path: "users", icon: <FaUsers /> },
  { name: "Analytics Dashboard", path: "analytics", icon: <FaChartBar /> },
  { name: "Seller Analytics", path: "seller-analytics", icon: <FaStore /> },
  {
    name: "User Subscriptions",
    path: "user-subscriptions",
    icon: <FaUserCheck />,
  },
  { name: "Delivery Config", path: "delivery-config", icon: <FaTruck /> },
  { name: "Payment Config", path: "payment-config", icon: <FaCreditCard /> },
];

const AdminSidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();

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
      </div>
    </aside>
  );
};

export default AdminSidebar;
