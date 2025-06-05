import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import "./AdminSidebar.css";

const adminLinks = [
  { name: "Dashboard", path: "dashboard", icon: <FaHome /> },
  { name: "Products", path: "products", icon: <FaBox /> },
  { name: "Orders", path: "orders", icon: <FaShoppingCart /> },
  { name: "Users", path: "users", icon: <FaUsers /> },
];

const AdminSidebar = () => {
  const { theme } = useTheme();
  return (
    <aside>
      <div className="admin-sidebar">
        <h2 style={{ color: "white", marginBottom: "20px" }}>Foodecom Admin</h2>
        <nav>
          <ul>
            {adminLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>
                  {link.icon} {link.name}
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
