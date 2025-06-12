/* eslint-disable no-unused-vars */
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./App.css";
import Home from "./Pages/Home/index";

import Navbar from "./Pages/Home/Navbar";
import Menu from "./Pages/Home/Menu";
import Offers from "./Pages/Home/Offers";
import Restaurants from "./Pages/Home/Restaurants";
import Track from "./Pages/Home/Track";
import Footer from "./Components/Footer/index";
import Login from "./Components/Login/Login";
import Register from "./Components/Login/Register";
import AdminLayout from "./Components/AdminLayout";
import SellerLayout from "./Components/SellerLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import Orders from "./Pages/admin/Orders";
import Users from "./Pages/admin/Users";
import AnalyticsDashboard from "./Pages/admin/AnalyticsDashboard";
import SellerAnalytics from "./Pages/admin/SellerAnalytics";
import UserSubscriptions from "./Pages/admin/UserSubscriptions";
import DeliveryPartnerConfig from "./Pages/admin/DeliveryPartnerConfig";
import PaymentGatewayConfig from "./Pages/admin/PaymentGatewayConfig";
import SellerDashboard from "./Pages/Seller/SellerDashboard";
import SellerProducts from "./Pages/Seller/SellerProducts";
import AddProduct from "./Pages/Seller/AddProduct";
import SellerOrders from "./Pages/Seller/SellerOrders";
import SellerCustomers from "./Pages/Seller/SellerCustomers";
import Cart from "./Components/Cart/Cart";
import UserProfile from "./Components/UserProfile/UserProfile";

function LayoutWrapper() {
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  // Define paths where you DON'T want header, navbar, footer
  const hideLayoutPaths = [
    "/login",
    "/register",
    "/admin",
    "/admin/dashboard",
    "/admin/products",
    "/admin/orders",
    "/admin/users",
    "/admin/analytics",
    "/admin/seller-analytics",
    "/admin/user-subscriptions",
    "/admin/delivery-config",
    "/admin/payment-config",
    "/seller",
    "/seller/dashboard",
    "/seller/products/all",
    "/seller/products/add",
    "/seller/orders",
    "/seller/customers",
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideLayout && <Navbar onProfileClick={() => setShowProfile(true)} />}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="offer" element={<Offers />} />
        <Route path="restaurant" element={<Restaurants />} />
        <Route path="trackorder" element={<Track />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="seller-analytics" element={<SellerAnalytics />} />
          <Route path="user-subscriptions" element={<UserSubscriptions />} />
          <Route path="delivery-config" element={<DeliveryPartnerConfig />} />
          <Route path="payment-config" element={<PaymentGatewayConfig />} />
        </Route>

        <Route
          path="seller"
          element={
            <ProtectedRoute allowedRoles={["shopowner"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
