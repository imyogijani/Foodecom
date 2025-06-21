/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./restaurant.css";
import axios from "axios";
import { restaurantInfo, menuCategories } from "../../data/menuData";
import { useCart } from "../../context/CartContext";

export default function Menu() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/admin/menu");
        const sortedItems = response.data.data.sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return a.category.localeCompare(b.category);
        });
        setMenuItems(sortedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filterItems = (items) => {
    let filtered = items;

    if (activeTab !== "All" && activeTab !== "Offers") {
      filtered = filtered.filter((item) => item.category === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  const renderOffers = () => {
    return (
      <div className="offers-grid">
        <p>Offers will be displayed here.</p>
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
          <div className="compact-menu-card" key={item._id}>
            <div className="card-content">
              <div className="item-info">
                <h4 className="item-title">{item.name}</h4>
                {item.isPremium && (
                  <span className="premium-badge">Premium</span>
                )}
                <p className="item-description">
                  {item.description && item.description.length > 60
                    ? item.description.substring(0, 60) + "..."
                    : item.description}
                </p>
                <div className="simple-price">
                  <span className="price-tag">₹{item.price}</span>
                </div>
              </div>
              <div className="item-image-container">
                <div className="circular-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <button
                  className="add-btn"
                  aria-label="Add to cart"
                  onClick={() =>
                    addToCart({
                      id: item._id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })
                  }
                >
                  +
                </button>
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

    const itemsToDisplay = filterItems(menuItems);

    if (activeTab === "Offers") {
      return renderOffers();
    }

    return (
      <div className="menu-section">
        <h3 className="menu-category-title">
          {activeTab === "All" ? "All Menu Items" : activeTab}
        </h3>
        {itemsToDisplay.length > 0 ? (
          renderMenuItems(itemsToDisplay)
        ) : (
          <p>No items found for this category or search query.</p>
        )}
      </div>
    );
  };

  return (
    <div className="restaurant-page">
      <div className="restaurant-hero">
        <div className="hero-content">
          <h1>{restaurantInfo.name}</h1>
          <p>{restaurantInfo.description}</p>
          <div className="rating">
            {renderStars(restaurantInfo.rating)}
            <span>({restaurantInfo.reviews} reviews)</span>
          </div>
          <p className="cuisine">{restaurantInfo.cuisine}</p>
          <p className="address">{restaurantInfo.address}</p>
          <p className="hours">{restaurantInfo.hours}</p>
        </div>
      </div>

      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search menu items..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="category-tabs">
          <button
            className={activeTab === "All" ? "active" : ""}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={activeTab === category.name ? "active" : ""}
              onClick={() => setActiveTab(category.name)}
            >
              {category.name}
            </button>
          ))}
          <button
            className={activeTab === "Offers" ? "active" : ""}
            onClick={() => setActiveTab("Offers")}
          >
            Offers
          </button>
        </div>
      </div>

      <div className="menu-content">
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
        <div className="menu-content">{renderContent()}</div>
      </div>

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
              <span className="value">{menuItems.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Popular Items:</span>
              <span className="value">
                {menuItems.filter((item) => item.isPopular).length}
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
