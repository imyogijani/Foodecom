import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar open/close for mobile
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Hamburger button for mobile */}
      <button
        className="admin-hamburger-btn"
        onClick={handleSidebarToggle}
        aria-label="Open sidebar"
        style={{
          position: "fixed",
          top: 20,
          left: sidebarOpen ? 280 : 20,
          zIndex: 200,
          background: "var(--dark-blue)",
          border: "none",
          borderRadius: 6,
          width: 44,
          height: 44,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "left 0.3s ease",
        }}
      >
        <span className="hamburger-lines">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Sidebar and overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "var(--dark-blue)",
          zIndex: 100,
          transition: "transform 0.3s ease",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className={`admin-sidebar-mobile${sidebarOpen ? " open" : ""}`}
      >
        <AdminSidebar onClose={handleSidebarClose} />
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={handleSidebarClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        ></div>
      )}
      {/* Main content */}
      <div
        style={{
          marginLeft: "280px",
          flexGrow: 1,
          overflowY: "auto",
          height: "100vh",
        }}
        className="admin-main-content"
      >
        <Outlet />
      </div>
      <style>{`
        @media (max-width: 900px) {
          .admin-main-content {
            margin-left: 0 !important;
            padding-top: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .admin-hamburger-btn {
            display: flex !important;
          }
          .admin-sidebar-mobile {
            width: 260px;
            min-width: 220px;
            max-width: 90vw;
            box-shadow: 2px 0 8px rgba(0,0,0,0.08);
            background: var(--dark-blue);
            transition: transform 0.3s ease;
            will-change: transform;
          }
          .admin-sidebar-mobile:not(.open) {
            transform: translateX(-100%);
          }
        }
        .hamburger-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .hamburger-lines span {
          display: block;
          width: 24px;
          height: 3px;
          background: #fff;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
