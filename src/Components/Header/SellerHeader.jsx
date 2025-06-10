import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

import "./AdminHeader.css"; // Reusing AdminHeader.css for now
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const SellerHeader = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header>
      <nav>
        <h1 style={{ color: "white" }}>
          {theme === "light" ? "Seller Panel" : "Seller Panel Dark"}
        </h1>
        <ul>
          <li>
            <Link to="/seller/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/seller/products">Products</Link>
          </li>
          <li>
            <Link to="/seller/orders">Orders</Link>
          </li>
        </ul>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </nav>
    </header>
  );
};

export default SellerHeader;
