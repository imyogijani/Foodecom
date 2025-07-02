/* eslint-disable no-unused-vars */
import React from "react";
import "./SellerDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaArrowUp,
  FaChartLine,
  FaShoppingBag,
  FaDollarSign,
} from "react-icons/fa";
import SellerNotification from "../../Components/SellerNotification";

const data = [
  { name: "Jan", sales: 4000, orders: 2400 },
  { name: "Feb", sales: 3000, orders: 1398 },
  { name: "Mar", sales: 2000, orders: 9800 },
  { name: "Apr", sales: 2780, orders: 3908 },
  { name: "May", sales: 1890, orders: 4800 },
  { name: "Jun", sales: 2390, orders: 3800 },
  { name: "Jul", sales: 3490, orders: 4300 },
];

const recentOrders = [
  { id: 1, customer: "John Doe", amount: 89.99, status: "Delivered" },
  { id: 2, customer: "Jane Smith", amount: 149.99, status: "Processing" },
  { id: 3, customer: "Mike Johnson", amount: 75.5, status: "Pending" },
];

const SellerDashboard = () => {
  return (
    <div className="seller-dashboard">
      <SellerNotification />
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p className="seller-subtitle">
          Monitor your store's performance and orders
        </p>
      </div>

      <div className="cards-grid cards-grid-medium">
        <div className="card-base card-medium seller-card">
          <div className="card-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "#28a745",
                  marginRight: "12px",
                }}
              >
                <FaDollarSign />
              </div>
              <div>
                <h3 className="card-title">Today's Sales</h3>
                <p
                  className="card-subtitle"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#232f3e",
                  }}
                >
                  ₹1,890
                </p>
                <p
                  className="card-description"
                  style={{
                    color: "#28a745",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaArrowUp /> +10.2% from yesterday
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base card-medium seller-card">
          <div className="card-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "#28a745",
                  marginRight: "12px",
                }}
              >
                <FaShoppingBag />
              </div>
              <div>
                <h3 className="card-title">Total Products</h3>
                <p
                  className="card-subtitle"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#232f3e",
                  }}
                >
                  157
                </p>
                <p
                  className="card-description"
                  style={{
                    color: "#28a745",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaArrowUp /> +5 new this week
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base card-medium seller-card">
          <div className="card-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "#28a745",
                  marginRight: "12px",
                }}
              >
                <FaChartLine />
              </div>
              <div>
                <h3 className="card-title">Pending Orders</h3>
                <p
                  className="card-subtitle"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#232f3e",
                  }}
                >
                  24
                </p>
                <p
                  className="card-description"
                  style={{
                    color: "#28a745",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaArrowUp /> +3 from yesterday
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base card-medium seller-card">
          <div className="card-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "#28a745",
                  marginRight: "12px",
                }}
              >
                ⭐
              </div>
              <div>
                <h3 className="card-title">Customer Rating</h3>
                <p
                  className="card-subtitle"
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#232f3e",
                  }}
                >
                  4.8
                </p>
                <p
                  className="card-description"
                  style={{
                    color: "#28a745",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaArrowUp /> +0.2 this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="sales-overview-title">Sales & Orders Overview</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-color-dark)" />
            <YAxis stroke="var(--text-color-dark)" />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          {/* You can add a table or list of recent orders here */}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
