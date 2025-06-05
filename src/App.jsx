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
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import Orders from "./Pages/admin/Orders";
import Users from "./Pages/admin/Users";

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
        <Route path="admin" element={<AdminLayout />} />
        <Route path="admin/dashboard" element={<Dashboard />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/orders" element={<Orders />} />
        <Route path="admin/users" element={<Users />} />
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
