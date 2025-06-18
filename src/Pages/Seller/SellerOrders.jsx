import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEdit, FaChevronDown } from "react-icons/fa";
import "../../App.css";
import "./SellerOrders.css";

const tempOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    city: "New York",
    date: "2024-03-15",
    items: 3,
    orderDetails: [
      { name: "Classic Burger", quantity: 2, rate: 12.99, total: 25.98 },
      { name: "French Fries", quantity: 1, rate: 4.99, total: 4.99 },
      { name: "Coca Cola", quantity: 2, rate: 2.99, total: 5.98 }
    ],
    status: "Delivered",
    total: 36.95 // Sum of all items: 25.98 + 4.99 + 5.98
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    city: "Los Angeles",
    date: "2024-03-14",
    items: 2,
    orderDetails: [
      { name: "Margherita Pizza", quantity: 1, rate: 15.99, total: 15.99 },
      { name: "Garlic Bread", quantity: 2, rate: 4.99, total: 9.98 }
    ],
    status: "Preparing",
    total: 25.97 // Sum of all items: 15.99 + 9.98
  }
  
];

const SellerOrders = () => {
  const [filters, setFilters] = useState({
    date: "",
    city: "",
    status: ""
  });

  const [filteredOrders, setFilteredOrders] = useState(tempOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const orderStatuses = ["Preparing", "Out for Delivery", "Delivered"];

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...tempOrders];

    if (filters.date) {
      filtered = filtered.filter(order => order.date === filters.date);
    }
    if (filters.city) {
      filtered = filtered.filter(order => 
        order.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilters({
      date: "",
      city: "",
      status: ""
    });
    setFilteredOrders(tempOrders);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const toggleDropdown = (orderId, event) => {
    if (dropdownOpen === orderId) {
      setDropdownOpen(null);
    } else {
      // Calculate position for the dropdown
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const dropdownTop = rect.bottom + 5;
      const dropdownLeft = rect.right - 150; // Align to right edge of button
      
      setDropdownPosition({ top: dropdownTop, left: dropdownLeft });
      setDropdownOpen(orderId);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    // Update the order status in the filtered orders
    setFilteredOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
    
    // Also update in the original tempOrders array
    const orderIndex = tempOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      tempOrders[orderIndex].status = newStatus;
    }
    
    setDropdownOpen(null);
  };

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Orders</h1>
        <p className="admin-subtitle">Manage your food orders</p>
      </div>
      <div className="orders-container">
        <div className="filters-section">
          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              placeholder="Select date"
            />
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Filter by city"
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.city}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view" 
                        onClick={() => handleViewOrder(order)}
                        title="View Order Details"
                      >
                        <FaEye />
                      </button>
                      <div className="dropdown-container" ref={dropdownRef}>
                        <button 
                          className="action-btn update"
                          onClick={(event) => toggleDropdown(order.id, event)}
                          title="Update Order Status"
                        >
                          <FaEdit />
                          <FaChevronDown className="dropdown-arrow" />
                        </button>
                        {dropdownOpen === order.id && (
                          <div className="status-dropdown" style={dropdownPosition}>
                            {orderStatuses.map((status) => (
                              <button
                                key={status}
                                className={`dropdown-item ${order.status === status ? 'active' : ''}`}
                                onClick={() => handleStatusUpdate(order.id, status)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.id}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
              </div>
              <div className="order-items">
                <h3>Ordered Items</h3>
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
                    {selectedOrder.orderDetails.map((item, index) => (
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
                      <td colSpan="3" className="total-label">Total Amount:</td>
                      <td className="total-amount">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders; 