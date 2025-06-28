import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./HomeLayout.css";

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const item = location.state?.item;

  if (!item) {
    return (
      <div className="home-layout-container-narrow" style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product details.</p>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginTop: 16, 
            padding: "0.5rem 1.5rem", 
            borderRadius: 8, 
            border: "none", 
            background: "#fc8a06", 
            color: "#fff", 
            fontWeight: 600, 
            cursor: "pointer" 
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="home-layout-container-narrow" style={{ 
      margin: "2.5rem auto", 
      background: "#fff", 
      borderRadius: 16, 
      boxShadow: "0 4px 24px rgba(0,0,0,0.09)", 
      padding: "2.5rem 2rem", 
      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' 
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img 
          src={item.image} 
          alt={item.title} 
          style={{ 
            width: 260, 
            height: 260, 
            objectFit: "cover", 
            borderRadius: 12, 
            marginBottom: 24, 
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)" 
          }} 
        />
        <h2 style={{ 
          fontSize: "2rem", 
          fontWeight: 700, 
          color: "#1a1a2e", 
          marginBottom: 12, 
          textAlign: "center" 
        }}>
          {item.title}
        </h2>
        <div style={{ 
          fontSize: "1.1rem", 
          color: "#444", 
          marginBottom: 18, 
          textAlign: "center", 
          lineHeight: 1.6 
        }}>
          {item.desc}
        </div>
        <div style={{ 
          fontSize: "1.35rem", 
          fontWeight: 700, 
          color: "#fc8a06", 
          marginBottom: 24 
        }}>
          {item.price}
        </div>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            padding: "0.5rem 1.5rem", 
            borderRadius: 8, 
            border: "none", 
            background: "#fc8a06", 
            color: "#fff", 
            fontWeight: 600, 
            cursor: "pointer" 
          }}
        >
          Back to Products
        </button>
      </div>
    </div>
  );
} 