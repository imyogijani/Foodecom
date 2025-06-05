import React from "react";
import Logo from "../../images/LOGO1.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import usr from "../../images/MaleUser.png";
import ThemeToggle from "../../Components/ThemeToggle/ThemeToggle";
import { useTheme } from "../../ThemeContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Menu", path: "/menu" },
  { name: "Special offers", path: "/Offer" },
  { name: "Restaurant", path: "/Restaurant" },
  { name: "Track order", path: "/TrackOrder" },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div className="navbar">
        <div className="row">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="navbar-container">
            <div className="navlinks d-flex align-items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-item ${
                    location.pathname === link.path ? " active" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="reg_btn nav-buttons d-flex align-items-center gap-3">
                <img src={usr} alt="user" />
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                >
                  Login/Signup
                </Link>
              </div>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
