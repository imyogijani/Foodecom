/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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

const SellerDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    totalProducts: 0,
    pendingOrders: 0,
    customerRating: 0,
    salesGrowth: 0,
    productsGrowth: 0,
    ordersGrowth: 0,
    ratingGrowth: 0,
  });

  useEffect(() => {
    // Fetch sales data
    const fetchSalesData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/sales-data");
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/dashboard-stats");
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    // Fetch recent orders
    const fetchRecentOrders = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/recent-orders");
        const data = await response.json();
        setRecentOrders(data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    fetchSalesData();
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  return (
    <div className="seller-dashboard">
      <SellerNotification />
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p className="seller-subtitle">
          Monitor your store's performance and orders
        </p>
      </div>

      <div className="seller-grid">
        <div className="responsive-card seller-card">
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
                  ₹{dashboardStats.todaySales}
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
                  <FaArrowUp /> +{dashboardStats.salesGrowth}% from yesterday
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="responsive-card seller-card">
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
                  {dashboardStats.totalProducts}
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
                  <FaArrowUp /> +{dashboardStats.productsGrowth} new this week
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="responsive-card seller-card">
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
                  {dashboardStats.pendingOrders}
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
                  <FaArrowUp /> +{dashboardStats.ordersGrowth} from yesterday
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="responsive-card seller-card">
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
                  {dashboardStats.customerRating}
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
                  <FaArrowUp /> +{dashboardStats.ratingGrowth} this month
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
            data={salesData}
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
