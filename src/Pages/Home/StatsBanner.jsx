import React from "react";
import "./StatsBanner.css";

export default function StatsBanner() {
  return (
    <div className="stats-banner">
      <div className="stat">
        <h2>546+</h2>
        <p>Registered Riders</p>
      </div>
      <div className="divider"></div>
      <div className="stat">
        <h2>789,900+</h2>
        <p>Orders Delivered</p>
      </div>
      <div className="divider"></div>
      <div className="stat">
        <h2>690+</h2>
        <p>Restaurants Partnered</p>
      </div>
      <div className="divider"></div>
      <div className="stat">
        <h2>17,457+</h2>
        <p>Food items</p>
      </div>
    </div>
  );
} 