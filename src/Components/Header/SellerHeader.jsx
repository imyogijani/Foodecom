import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import "./AdminHeader.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const SellerHeader = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header>
      <nav>
        <h1 style={{ color: "white" }}>
          {theme === "light" ? "E-Mall" : "E-Mall Dark"}
        </h1>
        <ul>
          <li>
            <Link to="/seller/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/seller/products/all">Products</Link>
          </li>
          <li>
            <Link to="/seller/orders">Orders</Link>
          </li>
          <li>
            <Link to="/seller/customers">Customers</Link>
          </li>
        </ul>
        <div className="theme-toggle-container">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </nav>
    </header>
  );
};

export default SellerHeader;
