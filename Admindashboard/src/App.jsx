import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Users from "./Pages/admin/Users";
import Products from "./Pages/admin/Products";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
