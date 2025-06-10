import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SellerSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
