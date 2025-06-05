import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside>
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/products">Products</Link>
        </li>
        <li>
          <Link to="/admin/orders">Orders</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
