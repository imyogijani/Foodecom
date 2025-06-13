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
import { FaArrowUp, FaChartLine, FaShoppingBag, FaDollarSign } from "react-icons/fa";

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
  { id: 3, customer: "Mike Johnson", amount: 75.50, status: "Pending" },
];

const SellerDashboard = () => {
  return (
    <div className="seller-dashboard">
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p className="seller-subtitle">Monitor your store's performance and orders</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Today's Sales</div>
          <div className="stat-value">$1,890</div>
          <div className="stat-change">
            <FaArrowUp /> +10.2% from yesterday
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Products</div>
          <div className="stat-value">157</div>
          <div className="stat-change">
            <FaArrowUp /> +5 new this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">24</div>
          <div className="stat-change">
            <FaArrowUp /> +3 from yesterday
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Customer Rating</div>
          <div className="stat-value">4.8</div>
          <div className="stat-change">
            <FaArrowUp /> +0.2 this month
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
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
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
