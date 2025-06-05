import React from "react";
// import AdminHeader from "./Header/AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div>
      {/* <AdminHeader /> */}
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
