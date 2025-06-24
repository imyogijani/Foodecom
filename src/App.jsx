import { useState, useEffect } from "react";
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
import Shops from "./Pages/Home/Shops";
import Footer from "./Components/Footer/index";
import Login from "./Components/Login/Login";
import Register from "./Components/Login/Register";
import Pricing from "./Components/Login/Pricing";
import AdminLayout from "./Components/AdminLayout";
import SellerLayout from "./Components/SellerLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import Orders from "./Pages/admin/Orders";
import Users from "./Pages/admin/Users";
import Subscriptions from "./Pages/admin/Subscriptions";
import Categories from "./Pages/admin/Categories";
import AdminMenu from "./Pages/admin/Menu";
import SellerDashboard from "./Pages/Seller/SellerDashboard";
import SellerProducts from "./Pages/Seller/SellerProducts";
import AddProduct from "./Pages/Seller/AddProduct";
import SellerOrders from "./Pages/Seller/SellerOrders";
import SellerCustomers from "./Pages/Seller/SellerCustomers";
import Cart from "./Components/Cart/Cart";
import UserProfile from "./Components/UserProfile/UserProfile";
import { CartProvider } from "./context/CartContext";
import CartFloatingButton from "./Components/CartFloatingButton";

function LayoutWrapper() {
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const location = useLocation();

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth <= 1024; // Tablet and mobile breakpoint
      setIsMobileOrTablet(isMobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Define paths where you DON'T want header, navbar, footer
  const hideLayoutPaths = [
    "/login",
    "/register",
    "/admin",
    "/admin/dashboard",
    "/admin/products",
    "/admin/orders",
    "/admin/users",
    "/admin/subscriptions",
    "/admin/categories",
    "/admin/menu",
    "/seller",
    "/seller/dashboard",
    "/seller/products/all",
    "/seller/products/add",
    "/seller/orders",
    "/seller/customers",
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname.toLowerCase());

  // Determine if we are on an admin, seller, login, or register route
  const isAdminOrSellerOrAuth =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  // Show cart button on all pages for mobile/tablet, or only on non-admin/seller/auth pages for desktop
  const shouldShowCartButton = isMobileOrTablet || !isAdminOrSellerOrAuth;

  return (
    <>
      {!hideLayout && <Navbar onProfileClick={() => setShowProfile(true)} />}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="offer" element={<Offers />} />
        <Route path="shops" element={<Shops />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="pricing" element={<Pricing />} />
        <Route
          path="cart"
          element={
            <ProtectedRoute allowedRoles={["client, admin, shopowner"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
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
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="menu" element={<AdminMenu />} />
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
      {/* Cart button rendered at the end to ensure it's not clipped by containers */}
      {shouldShowCartButton && <CartFloatingButton />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;
