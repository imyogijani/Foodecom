import React, { useState } from "react";
import "../../App.css";
import "./SellerCustomers.css";

const tempCustomers = [
  {
    id: "CUST001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    totalOrders: 1,
    totalSpent: 36.95,
    lastOrder: "2024-03-15",
    orders: [
      {
        id: "ORD001",
        date: "2024-03-15",
        items: 3,
        orderDetails: [
          { name: "Classic Burger", quantity: 2, rate: 12.99, total: 25.98 },
          { name: "French Fries", quantity: 1, rate: 4.99, total: 4.99 },
          { name: "Coca Cola", quantity: 2, rate: 2.99, total: 5.98 }
        ],
        status: "Delivered",
        total: 36.95
      }
    ]
  },
  {
    id: "CUST002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    city: "Los Angeles",
    totalOrders: 1,
    totalSpent: 25.97,
    lastOrder: "2024-03-14",
    orders: [
      {
        id: "ORD002",
        date: "2024-03-14",
        items: 2,
        orderDetails: [
          { name: "Margherita Pizza", quantity: 1, rate: 15.99, total: 15.99 },
          { name: "Garlic Bread", quantity: 2, rate: 4.99, total: 9.98 }
        ],
        status: "Preparing",
        total: 25.97
      }
    ]
  },
  {
    id: "CUST003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 345-6789",
    city: "Chicago",
    totalOrders: 1,
    totalSpent: 50.93,
    lastOrder: "2024-03-13",
    orders: [
      {
        id: "ORD003",
        date: "2024-03-13",
        items: 4,
        orderDetails: [
          { name: "Chicken Wings", quantity: 2, rate: 12.99, total: 25.98 },
          { name: "Caesar Salad", quantity: 1, rate: 8.99, total: 8.99 },
          { name: "Chocolate Cake", quantity: 1, rate: 6.99, total: 6.99 },
          { name: "Soft Drinks", quantity: 3, rate: 2.99, total: 8.97 }
        ],
        status: "Out for Delivery",
        total: 50.93
      }
    ]
  },
  {
    id: "CUST004",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 456-7890",
    city: "Miami",
    totalOrders: 1,
    totalSpent: 27.98,
    lastOrder: "2024-03-12",
    orders: [
      {
        id: "ORD004",
        date: "2024-03-12",
        items: 2,
        orderDetails: [
          { name: "Veggie Pizza", quantity: 1, rate: 14.99, total: 14.99 },
          { name: "Pasta Alfredo", quantity: 1, rate: 12.99, total: 12.99 }
        ],
        status: "Delivered",
        total: 27.98
      }
    ]
  },
  {
    id: "CUST005",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 567-8901",
    city: "Seattle",
    totalOrders: 1,
    totalSpent: 47.96,
    lastOrder: "2024-03-11",
    orders: [
      {
        id: "ORD005",
        date: "2024-03-11",
        items: 3,
        orderDetails: [
          { name: "Grilled Chicken", quantity: 2, rate: 16.99, total: 33.98 },
          { name: "Mashed Potatoes", quantity: 1, rate: 5.99, total: 5.99 },
          { name: "Garden Salad", quantity: 1, rate: 7.99, total: 7.99 }
        ],
        status: "Preparing",
        total: 47.96
      }
    ]
  }
];

const SellerCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleViewOrders = (customer) => {
    setSelectedCustomer(customer);
    setShowOrdersModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCustomer(null);
  };

  const closeOrdersModal = () => {
    setShowOrdersModal(false);
    setSelectedCustomer(null);
  };

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
                  <td>{customer.orders.length}</td>
                  <td>${customer.totalSpent.toFixed(2)}</td>
                  <td>{customer.lastOrder}</td>
                  <td>
                    <button className="action-btn view" onClick={() => handleViewCustomer(customer)}>View</button>
                    <button className="action-btn edit" onClick={() => handleViewOrders(customer)}>Orders</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showViewModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Customer Details - {selectedCustomer.name}</h2>
              <button className="close-btn" onClick={closeViewModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="customer-info">
                <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>City:</strong> {selectedCustomer.city}</p>
                <p><strong>Total Orders:</strong> {selectedCustomer.orders.length}</p>
                <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                <p><strong>Last Order:</strong> {selectedCustomer.lastOrder}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrdersModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order History - {selectedCustomer.name}</h2>
              <button className="close-btn" onClick={closeOrdersModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="customer-info">
                <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Total Orders:</strong> {selectedCustomer.orders.length}</p>
                <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="order-history">
                <h3>Order History</h3>
                {selectedCustomer.orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h4>Order #{order.id}</h4>
                      <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <p><strong>Date:</strong> {order.date}</p>
                      <p><strong>Items:</strong> {order.items}</p>
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderDetails.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>${item.rate.toFixed(2)}</td>
                              <td>${item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="total-label">Order Total:</td>
                            <td className="total-amount">${order.total.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCustomers; 