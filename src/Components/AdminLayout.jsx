import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    }}>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        backgroundColor: "var(--dark-blue)",
        zIndex: 100
      }}>
        <AdminSidebar />
      </div>
      <div style={{
        marginLeft: "280px",
        flexGrow: 1,
        overflowY: "auto",
        height: "100vh"
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
