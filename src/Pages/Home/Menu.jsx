/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./restaurant.css";
import "./HomeLayout.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    { id: "offer-1", title: "10% Off Electronics", image: "https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&w=400", discount: "-10%", store: "ElectroStore", badge: "NEW", price: "$0" },
    { id: "offer-2", title: "Buy 1 Get 1 Free Clothing", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", discount: "B1G1", store: "FashionHub", badge: "HOT", price: "$0" },
    { id: "offer-3", title: "Free Shipping on Orders Over $50", image: "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&w=400", discount: "FREE", store: "All Stores", badge: "LIMITED", price: "$0" },
  ],
  Electronics: [
    { id: "el-1", title: "Smartphone X", desc: "Latest smartphone with advanced features", image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400", price: "$499", isPopular: true },
    { id: "el-2", title: "Wireless Headphones", desc: "Noise-cancelling over-ear headphones", image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=400", price: "$99" },
    { id: "el-3", title: "Laptop Pro", desc: "High-performance laptop for professionals", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&w=400", price: "$1299", isPopular: true },
    { id: "el-4", title: "Smart Watch", desc: "Fitness tracking and notifications", image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&w=400", price: "$299" },
    { id: "el-5", title: "Gaming Console", desc: "Next-gen gaming experience", image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&w=400", price: "$399" },
    { id: "el-6", title: "4K Smart TV", desc: "Ultra HD television with smart features", image: "https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg?auto=compress&w=400", price: "$799", isPopular: true },
  ],
  Clothing: [
    { id: "cl-1", title: "Men's T-Shirt", desc: "100% cotton, various sizes", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", price: "$19" },
    { id: "cl-2", title: "Women's Dress", desc: "Elegant evening dress", image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=400", price: "$49" },
    { id: "cl-3", title: "Running Shoes", desc: "Comfortable athletic footwear", image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&w=400", price: "$89", isPopular: true },
    { id: "cl-4", title: "Denim Jacket", desc: "Classic denim jacket for all seasons", image: "https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&w=400", price: "$69" },
    { id: "cl-5", title: "Winter Coat", desc: "Warm and stylish winter protection", image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&w=400", price: "$129" },
    { id: "cl-6", title: "Formal Suit", desc: "Professional business attire", image: "https://images.pexels.com/photos/3251530/pexels-photo-3251530.jpeg?auto=compress&w=400", price: "$199", isPopular: true },
  ],
  "Home Appliances": [
    { id: "ha-1", title: "Blender Pro", desc: "Multi-speed kitchen blender", image: "https://images.pexels.com/photos/3768169/pexels-photo-3768169.jpeg?auto=compress&w=400", price: "$59" },
    { id: "ha-2", title: "Coffee Maker", desc: "Automatic coffee brewing machine", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=400", price: "$129" },
    { id: "ha-3", title: "Vacuum Cleaner", desc: "Powerful cordless vacuum", image: "https://images.pexels.com/photos/4109489/pexels-photo-4109489.jpeg?auto=compress&w=400", price: "$199" },
    { id: "ha-4", title: "Refrigerator", desc: "Large capacity fridge with freezer", image: "https://images.pexels.com/photos/3251531/pexels-photo-3251531.jpeg?auto=compress&w=400", price: "$899", isPopular: true },
    { id: "ha-5", title: "Washing Machine", desc: "Front-loading washer and dryer", image: "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&w=400", price: "$699" },
  ],
  Books: [
    { id: "bk-1", title: "Bestseller Novel", desc: "A thrilling mystery novel", image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400", price: "$12" },
    { id: "bk-2", title: "Self-Help Guide", desc: "Personal development and growth", image: "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&w=400", price: "$15" },
    { id: "bk-3", title: "Cookbook Collection", desc: "Delicious recipes for every occasion", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400", price: "$25" },
    { id: "bk-4", title: "Science Fiction", desc: "Epic space adventure novel", image: "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&w=400", price: "$18", isPopular: true },
    { id: "bk-5", title: "Children's Storybook", desc: "Beautifully illustrated stories", image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400", price: "$10" },
  ],
  Toys: [
    { id: "ty-1", title: "Building Blocks Set", desc: "Creative play for kids", image: "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg?auto=compress&w=400", price: "$25" },
    { id: "ty-2", title: "Remote Control Car", desc: "High-speed RC vehicle", image: "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&w=400", price: "$45" },
    { id: "ty-3", title: "Board Game", desc: "Family entertainment board game", image: "https://images.pexels.com/photos/187161/pexels-photo-187161.jpeg?auto=compress&w=400", price: "$35" },
    { id: "ty-4", title: "Doll House", desc: "Detailed miniature house for dolls", image: "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg?auto=compress&w=400", price: "$89", isPopular: true },
    { id: "ty-5", title: "Puzzle Set", desc: "1000-piece jigsaw puzzle", image: "https://images.pexels.com/photos/187161/pexels-photo-187161.jpeg?auto=compress&w=400", price: "$15" },
  ],
};

const getItemsByCategory = (category) => mallItemsByCategory[category] || [];
const getAllMallItems = () => Object.values(mallItemsByCategory).flat();

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
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

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({
      ...item,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    toast.success(`${item.title} added to cart! 🛒`);
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
              <button 
                className="plus-icon" 
                aria-label="Add to cart"
                onClick={(e) => handleAddToCart(e, offer)}
              >
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
    const filteredItems = filterItems(items);
    
    return (
      <div className="compact-menu-grid">
        {filteredItems.map((item) => (
          <div
            className="compact-menu-card"
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`, { state: { item } })}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ position: "relative" }}
          >
            <div className="card-content">
              <div className="circular-image">
                <img src={item.image} alt={item.title} loading="lazy" />
                {item.isPopular && (
                  <div className="popular-badge">🔥 Popular</div>
                )}
              </div>
              <div className="item-title-wrapper">
                <h4 className="item-title">{item.title}</h4>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={(e) => handleAddToCart(e, item)}
                aria-label={`Add ${item.title} to cart`}
              >
                +
              </button>
            </div>

            {hoveredItem === item.id && (
              <div className="product-popup">
                <p className="popup-price">{item.price}</p>
                <p className="popup-desc">{item.desc}</p>
              </div>
            )}
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
    <div className="home-layout-container restaurant-page">
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
