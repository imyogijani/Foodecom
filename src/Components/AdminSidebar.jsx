import React from "react";
import { Link } from "react-router-dom";

const adminLinks = [
  { name: "Dashboard", path: "dashboard" },
  { name: "Products", path: "products" },
  { name: "Orders", path: "orders" },
  { name: "Users", path: "users" },
];

const AdminSidebar = () => {
  return (
    <aside>
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            {adminLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style jsx>{`
        .admin-sidebar {
          width: 200px;
          background-color: #f8f9fa;
          padding: 20px;
          border-right: 1px solid #dee2e6;
        }
        .admin-sidebar h2 {
          margin-bottom: 20px;
        }
        .admin-sidebar nav ul {
          list-style-type: none;
          padding: 0;
        }
        .admin-sidebar nav ul li {
          margin: 10px 0;
        }
        .admin-sidebar nav ul li a {
          text-decoration: none;
          color: #007bff;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
