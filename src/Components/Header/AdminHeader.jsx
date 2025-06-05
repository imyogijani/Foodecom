import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

import "./AdminHeader.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const AdminHeader = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header>
      <nav>
        <h1 style={{ color: "white" }}>
          {theme === "light" ? "Foodecom" : "Foodecom Dark"}
        </h1>
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
        </ul>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </nav>
    </header>
  );
};

export default AdminHeader;
