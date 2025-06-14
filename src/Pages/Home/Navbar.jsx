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
    <nav className="navbar custom-navbar">
      <div className="navbar-section logo-section">
        <Link to="/" className="custom-logo">
          <span className="logo-main">Order</span>
          <span className="logo-uk">.UK</span>
        </Link>
      </div>
      <div className="navbar-section nav-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-pill-link${isActiveLink(link.path) ? " active" : ""}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="navbar-section nav-right">
        <Link to="/login" className="login-pill">
          <FaUserCircle className="login-icon" />
          <span>Login/Signup</span>
        </Link>
      </div>
    </nav>
  );
}
