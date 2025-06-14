import React, { useState, useEffect } from "react";
import "./restaurant.css";
import {
  restaurantInfo,
  menuCategories,
  getItemsByCategory,
  getAllMenuItems,
} from "../../data/menuData";

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Pizzas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()),
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
    return (
      <div className="offers-grid">
        {items.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <img src={offer.image} alt={offer.title} loading="lazy" />
            <div className="discount-badge">{offer.discount}</div>
            {offer.badge && <div className="special-badge">{offer.badge}</div>}
            <div className="offer-info">
              <span>{offer.restaurant}</span>
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

  const renderChiliRating = (rating) => {
    const chilis = Math.min(rating || 3, 5);
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`chili ${index < chilis ? "filled" : "empty"}`}
      >
        🌶️
      </span>
    ));
  };

  const renderMenuItems = (items) => {
    return (
      <div className="compact-menu-grid">
        {items.map((item) => (
          <div className="compact-menu-card" key={item.id}>
            <div className="card-content">
              <div className="item-info">
                <h4 className="item-title">{item.title}</h4>
                <div className="chili-rating">
                  {renderChiliRating(item.spiceLevel || 3)}
                </div>
                <p className="item-description">
                  {item.desc && item.desc.length > 60
                    ? item.desc.substring(0, 60) + "..."
                    : item.desc}
                </p>

                {item.sizes ? (
                  <div className="size-row">
                    {item.sizes.slice(0, 3).map((size, index) => (
                      <button
                        key={index}
                        className={`compact-size-btn ${size.name.toLowerCase()}`}
                      >
                        {size.name}{" "}
                        <span className="size-price">{size.price}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="simple-price">
                    <span className="price-tag">{item.price}</span>
                  </div>
                )}

                {item.xlOption && (
                  <div className="xl-option">
                    <button className="xl-btn">
                      {item.xlOption.name}{" "}
                      <span className="xl-price">{item.xlOption.price}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="item-image-container">
                <div className="circular-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                {!item.sizes && (
                  <button className="add-btn" aria-label="Add to cart">
                    +
                  </button>
                )}
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

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Browse Menu - {restaurantInfo.name}</h1>
            <div className="hero-tags">
              <span className="tag">Full Menu Available</span>
              <span className="tag">All Categories</span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/7192147/pexels-photo-7192147.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Menu items"
              loading="eager"
            />
          </div>
        </div>
        <div className="rating-badge">
          <span className="rating-number">{restaurantInfo.rating}</span>
          <div className="rating-stars">
            {renderStars(Math.floor(restaurantInfo.rating))}
          </div>
          <span className="rating-count">Browse All Items</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>Complete Menu from {restaurantInfo.name}</h2>
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
          {menuCategories.map((cat) => (
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
              <span className="value">{menuCategories.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Items:</span>
              <span className="value">{getAllMenuItems().length}</span>
            </div>
            <div className="info-item">
              <span className="label">Popular Items:</span>
              <span className="value">
                {getAllMenuItems().filter((item) => item.isPopular).length}
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
                ⭐ {restaurantInfo.rating} ({restaurantInfo.reviews} reviews)
              </span>
            </div>
            <div className="info-item">
              <span className="label">Minimum Order:</span>
              <span className="value">{restaurantInfo.minOrder}</span>
            </div>
            <div className="info-item">
              <span className="label">Delivery Time:</span>
              <span className="value">{restaurantInfo.deliveryTime}</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>📞 Contact</h3>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{restaurantInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Website:</span>
              <span className="value">{restaurantInfo.website}</span>
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
