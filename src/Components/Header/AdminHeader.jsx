import React from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <header>
      <nav>
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
      </nav>
    </header>
  );
};

export default AdminHeader;
