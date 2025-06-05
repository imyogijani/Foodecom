import React from "react";
import { FaMapMarkerAlt, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div className="header-container">
        <div
          className="d-flex justify-content-between align-items-center px-3"
          style={{
            backgroundColor: theme === "light" ? "#fff" : "#333",
            color: theme === "light" ? "#000" : "#fff",
            border: "1px solid #eee",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "sans-serif",
            margin: "0 20px",
            padding: "10px 0",
          }}
        >
          <h1 style={{ color: theme === "light" ? "black" : "white" }}>
            {theme === "light" ? "Foodecom" : "Foodecom Dark"}
          </h1>

          {/* Promo Message */}
          <div className="d-flex align-items-center">
            <span className="me-2" role="img" aria-label="sun">
              🌞
            </span>
            <span>
              Get 5% Off your first order,&nbsp;
              <span style={{ color: "#e48a00", fontWeight: 700 }}>
                Promo: ORDER5
              </span>
            </span>
          </div>

          {/* Location */}
          <div className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-1" style={{ fontSize: "13px" }} />
            <span>Regent Street, A4, A4201, London</span>
            <Link
              to="/change-location"
              className="ms-2"
              style={{
                color: "#e48a00",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Change Location
            </Link>
          </div>

          {/* Cart Summary */}
          <div
            className="d-flex align-items-center text-white"
            style={{
              justifyContent: "space-around",
              height: "8vh",
              width: "20vw",
              backgroundColor: "#028643",
              borderRadius: "0 0 10px 10px",
              textAlign: "center",
              padding: "0 15px",
            }}
          >
            <FaShoppingCart className="me-2" style={{ fontSize: "25px" }} />
            <span className="me-3" style={{ fontSize: "18px" }}>
              23 Items
            </span>
            <span className="me-2" style={{ fontSize: "18px" }}>
              GBP 79.89
            </span>
            <FaChevronDown style={{ cursor: "pointer" }} />
          </div>
        </div>

        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </>
  );
}
