import React from "react";
import "../../App.css";
import "./SellerCustomers.css";

const tempCustomers = [
  {
    id: "CUST001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    totalOrders: 3,
    totalSpent: 36.95,
    lastOrder: "2024-03-15"
  },
  {
    id: "CUST002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    city: "Los Angeles",
    totalOrders: 2,
    totalSpent: 25.97,
    lastOrder: "2024-03-14"
  },
  {
    id: "CUST003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 345-6789",
    city: "Chicago",
    totalOrders: 4,
    totalSpent: 50.93,
    lastOrder: "2024-03-13"
  },
  {
    id: "CUST004",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 456-7890",
    city: "Miami",
    totalOrders: 2,
    totalSpent: 27.98,
    lastOrder: "2024-03-12"
  },
  {
    id: "CUST005",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 567-8901",
    city: "Seattle",
    totalOrders: 3,
    totalSpent: 47.96,
    lastOrder: "2024-03-11"
  }
];

const SellerCustomers = () => {
  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Customers</h1>
        <p className="admin-subtitle">View and manage your customers</p>
      </div>
      <div className="customers-container">
        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tempCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.city}</td>
                  <td>{customer.totalOrders}</td>
                  <td>${customer.totalSpent.toFixed(2)}</td>
                  <td>{customer.lastOrder}</td>
                  <td>
                    <button className="action-btn view">View</button>
                    <button className="action-btn edit">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerCustomers; 