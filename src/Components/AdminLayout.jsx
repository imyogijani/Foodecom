import React from "react";
import AdminHeader from "./Header/AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* <AdminHeader /> */}
        <main style={{ flexGrow: 1, padding: "20px" }}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
