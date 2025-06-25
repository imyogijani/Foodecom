/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./restaurant.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// Minimal E-mall sample data
const mallInfo = {
  name: "E-Mall World Shopping Center",
  description: "Your one-stop destination for all shopping needs",
  rating: 4.5,
  reviews: 2500,
  minOrder: "$0.00",
  deliveryTime: "1-3 Business Days",
  phone: "+1-800-EMALL",
  website: "https://e-mallworld.com",
  address: "Global Online Shopping Mall",
};

const mallCategories = [
  "Offers",
  "Electronics",
  "Clothing",
  "Home Appliances",
  "Books",
  "Toys",
];

const mallItemsByCategory = {
  Offers: [
    { id: "offer-1", title: "10% Off Electronics", image: "https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&w=400", discount: "-10%", store: "ElectroStore", badge: "NEW" },
    { id: "offer-2", title: "Buy 1 Get 1 Free Clothing", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", discount: "B1G1", store: "FashionHub", badge: "HOT" },
  ],
  Electronics: [
    { id: "el-1", title: "Smartphone X", desc: "Latest smartphone with advanced features", image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400", price: "$499", isPopular: true },
    { id: "el-2", title: "Wireless Headphones", desc: "Noise-cancelling over-ear headphones", image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=400", price: "$99" },
  ],
  Clothing: [
    { id: "cl-1", title: "Men's T-Shirt", desc: "100% cotton, various sizes", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", price: "$19" },
    { id: "cl-2", title: "Women's Dress", desc: "Elegant evening dress", image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=400", price: "$49" },
  ],
  "Home Appliances": [
    { id: "ha-1", title: "Blender Pro", desc: "Multi-speed kitchen blender", image: "https://images.pexels.com/photos/3768169/pexels-photo-3768169.jpeg?auto=compress&w=400", price: "$59" },
  ],
  Books: [
    { id: "bk-1", title: "Bestseller Novel", desc: "A thrilling mystery novel", image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400", price: "$12" },
  ],
  Toys: [
    { id: "ty-1", title: "Building Blocks Set", desc: "Creative play for kids", image: "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg?auto=compress&w=400", price: "$25" },
  ],
};

const getItemsByCategory = (category) => mallItemsByCategory[category] || [];
const getAllMallItems = () => Object.values(mallItemsByCategory).flat();

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Pizzas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filterItems = (items) => {
    if (!searchQuery || !items) return items;
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  const renderOffers = (items) => {
    if (!items) return null;
    return (
      <div className="offers-grid">
        {items.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <img src={offer.image} alt={offer.title} loading="lazy" />
            <div className="discount-badge">{offer.discount}</div>
            {offer.badge && <div className="special-badge">{offer.badge}</div>}
            <div className="offer-info">
              <span>{offer.store}</span>
              <h4>{offer.title}</h4>
              <button className="plus-icon" aria-label="Add to cart">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMenuItems = (items) => {
    if (!items) return null;
    return (
      <div className="compact-menu-grid">
        {items.map((item) => (
          <div
            className="compact-menu-card"
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`, { state: { item } })}
            style={{ cursor: "pointer" }}
          >
            <div className="card-content">
              <div className="circular-image">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="item-title-wrapper">
                <h4 className="item-title">{item.title}</h4>
              </div>
              <div className="item-hover-details">
                <div className="item-description">{item.desc}</div>
                <div className="item-price">{item.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading menu items...</p>
        </div>
      );
    }

    const items = getItemsByCategory(activeTab);
    if (!items) return null;

    if (activeTab === "Offers") {
      return renderOffers(items);
    }

    return (
      <div className="menu-section">
        <h3 className="menu-category-title">{activeTab}</h3>
        {renderMenuItems(items)}
      </div>
    );
  };

  const menuCats = mallCategories || [];
  const allMenuItems = getAllMallItems() || [];

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{mallInfo?.name}</h1>
            <div className="hero-tags">
              <span className="tag">Full Menu Available</span>
              <span className="tag">All Categories</span>
            </div>
          </div>
          <div className="hero-image">
            
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>Complete Menu from {mallInfo?.name}</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search from menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="menu-tabs">
          {menuCats.map((cat) => (
            <button
              key={cat}
              className={`menu-tab ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-content">{renderContent()}</div>
      </div>

      {/* Quick Stats */}
      <div className="delivery-info-section">
        <div className="delivery-info-grid">
          <div className="delivery-info-card">
            <h3>📋 Menu Information</h3>
            <div className="info-item">
              <span className="label">Total Categories:</span>
              <span className="value">{menuCats.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Items:</span>
              <span className="value">{allMenuItems.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Popular Items:</span>
              <span className="value">
                {allMenuItems.filter((item) => item?.isPopular).length}
              </span>
            </div>
            <div className="info-item highlight">
              <span className="label">⏱️ Updated:</span>
              <span className="value">Daily</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>🏪 Restaurant Info</h3>
            <div className="info-item">
              <span className="label">Rating:</span>
              <span className="value">
                ⭐ {mallInfo?.rating} ({mallInfo?.reviews} reviews)
              </span>
            </div>
            <div className="info-item">
              <span className="label">Minimum Order:</span>
              <span className="value">{mallInfo?.minOrder}</span>
            </div>
            <div className="info-item">
              <span className="label">Delivery Time:</span>
              <span className="value">{mallInfo?.deliveryTime}</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>📞 Contact</h3>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{mallInfo?.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Website:</span>
              <span className="value">{mallInfo?.website}</span>
            </div>
            <div className="info-item">
              <span className="label">Location:</span>
              <span className="value">London Bridge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
