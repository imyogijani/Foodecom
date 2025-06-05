import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import "./AdminSidebar.css";
import ThemeToggle from "./ThemeToggle/ThemeToggle";

const adminLinks = [
  { name: "Dashboard", path: "dashboard" },
  { name: "Products", path: "products" },
  { name: "Orders", path: "orders" },
  { name: "Users", path: "users" },
];

const AdminSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside>
      <div className="admin-sidebar">
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          {theme === "light" ? "Foodecom Admin" : "Foodecom Admin Dark"}
        </h2>
        <nav>
          <ul>
            {adminLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </aside>
  );
};

export default AdminSidebar;
