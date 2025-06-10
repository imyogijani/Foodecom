import React from "react";
import "../../App.css";
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

const data = [
  { name: "Jan", sales: 4000, orders: 2400 },
  { name: "Feb", sales: 3000, orders: 1398 },
  { name: "Mar", sales: 2000, orders: 9800 },
  { name: "Apr", sales: 2780, orders: 3908 },
  { name: "May", sales: 1890, orders: 4800 },
  { name: "Jun", sales: 2390, orders: 3800 },
  { name: "Jul", sales: 3490, orders: 4300 },
];

const SellerDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Seller Dashboard</h1>
        <p className="admin-subtitle">Monitor your store performance</p>
      </div>

      <div className="chart-container">
        <h2 className="sales-overview-title">Sales Overview</h2>
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
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SellerDashboard;
