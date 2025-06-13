import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerAnalytics = () => {
  const [selectedSeller, setSelectedSeller] = useState("seller1");

  const sellersData = {
    seller1: {
      name: "GadgetHub",
      totalSales: 75000,
      totalOrders: 1200,
      productsSold: 2500,
      performanceData: [
        { month: "Jan", sales: 5000 },
        { month: "Feb", sales: 7000 },
        { month: "Mar", sales: 10000 },
        { month: "Apr", sales: 12000 },
        { month: "May", sales: 15000 },
        { month: "Jun", sales: 26000 },
      ],
    },
    seller2: {
      name: "FashionFiesta",
      totalSales: 50000,
      totalOrders: 900,
      productsSold: 1800,
      performanceData: [
        { month: "Jan", sales: 4000 },
        { month: "Feb", sales: 6000 },
        { month: "Mar", sales: 8000 },
        { month: "Apr", sales: 10000 },
        { month: "May", sales: 11000 },
        { month: "Jun", sales: 11000 },
      ],
    },
    seller3: {
      name: "HomeEssentials",
      totalSales: 30000,
      totalOrders: 500,
      productsSold: 1000,
      performanceData: [
        { month: "Jan", sales: 2000 },
        { month: "Feb", sales: 3000 },
        { month: "Mar", sales: 5000 },
        { month: "Apr", sales: 6000 },
        { month: "May", sales: 7000 },
        { month: "Jun", sales: 7000 },
      ],
    },
  };

  const currentSeller = sellersData[selectedSeller];

  const handleSellerChange = (event) => {
    setSelectedSeller(event.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Analytics</h1>

      {/* Overview Table for All Sellers */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">All Sellers Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Seller Name</th>
                <th className="py-2 px-4 border-b text-left">Total Sales</th>
                <th className="py-2 px-4 border-b text-left">Total Orders</th>
                <th className="py-2 px-4 border-b text-left">Products Sold</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sellersData).map((key) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {sellersData[key].name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    ${sellersData[key].totalSales.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {sellersData[key].totalOrders.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {sellersData[key].productsSold.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="seller-select"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Select Seller:
        </label>
        <select
          id="seller-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedSeller}
          onChange={handleSellerChange}
        >
          {Object.keys(sellersData).map((key) => (
            <option key={key} value={key}>
              {sellersData[key].name}
            </option>
          ))}
        </select>
      </div>

      {currentSeller && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {currentSeller.name} Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-green-600">
                ${currentSeller.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">
                {currentSeller.totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Products Sold</h3>
              <p className="text-3xl font-bold text-purple-600">
                {currentSeller.productsSold.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Sales Performance Over Time
            </h2>
            <div className="h-80">
              <Bar
                data={{
                  labels: currentSeller.performanceData.map(
                    (data) => data.month
                  ),
                  datasets: [
                    {
                      label: "Sales",
                      data: currentSeller.performanceData.map(
                        (data) => data.sales
                      ),
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                      borderColor: "rgb(75, 192, 192)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `${currentSeller.name} Sales Performance`,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerAnalytics;
