
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* <AdminHeader /> */}
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
