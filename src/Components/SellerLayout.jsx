import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import { SellerHeader } from "./Header";
import Footer from "./Footer";

const SellerLayout = () => {
  return (
    <div className="admin-layout">
      {/* <SellerHeader /> */}
      <SellerSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default SellerLayout;
