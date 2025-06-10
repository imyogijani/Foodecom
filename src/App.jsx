/* eslint-disable no-unused-vars */
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/index";

import Navbar from "./Pages/Home/Navbar";
import Menu from "./Pages/Home/Menu";
import Offers from "./Pages/Home/Offers";
import Restaurants from "./Pages/Home/Restaurants";
import Track from "./Pages/Home/Track";
import Footer from "./Components/Footer/index";
import Login from "./Components/Login/registration";
import AdminLayout from "./Components/AdminLayout";
import SellerLayout from "./Components/SellerLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import Orders from "./Pages/admin/Orders";
import Users from "./Pages/admin/Users";
import SellerDashboard from "./Pages/Seller/SellerDashboard";
import SellerProducts from "./Pages/Seller/SellerProducts";
import AddProduct from "./Pages/Seller/AddProduct";
import SellerOrders from "./Pages/Seller/SellerOrders";
import SellerCustomers from "./Pages/Seller/SellerCustomers";

function LayoutWrapper() {
  const location = useLocation();

  // Define paths where you DON'T want header, navbar, footer
  const hideLayoutPaths = [
    "/login",
    "/admin",
    "/admin/dashboard",
    "/admin/products",
    "/admin/orders",
    "/admin/users",
    "/seller",
    "/seller/dashboard",
    "/seller/products/all",
    "/seller/products/add",
    "/seller/orders",
    "/seller/customers"
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="offer" element={<Offers />} />
        <Route path="restaurant" element={<Restaurants />} />
        <Route path="trackorder" element={<Track />} />
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products/all" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="customers" element={<SellerCustomers />} />
        </Route>
        {/* Add more routes as needed */}
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
