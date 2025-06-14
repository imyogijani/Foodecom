import React, { useState } from "react";
import "./restaurant.css";
import {
  restaurantInfo,
  offerItems,
  getAllMenuItems,
} from "../../data/menuData";

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filterOffers = (offers) => {
    if (!searchQuery) return offers;
    return offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.restaurant.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  // Get special offer items from all menu items
  const specialOfferItems = getAllMenuItems()
    .filter(
      (item) => item.badge === "SPECIAL" || item.promoText || item.isPopular,
    )
    .slice(0, 6);

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Special Offers - {restaurantInfo.name}</h1>
            <div className="hero-tags">
              <span className="tag">Limited Time Offers</span>
              <span className="tag">Great Savings</span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/7192147/pexels-photo-7192147.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Special offers"
              loading="eager"
            />
          </div>
        </div>
        <div className="rating-badge">
          <span className="rating-number">🎉</span>
          <div className="rating-stars">{renderStars(5)}</div>
          <span className="rating-count">Special Deals</span>
        </div>
      </div>

      {/* Offers Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>All Special Offers from {restaurantInfo.name}</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Main Offers */}
        <div className="menu-content">
          <div className="menu-section">
            <h3 className="menu-category-title">Featured Offers</h3>
            <div className="offers-grid">
              {filterOffers(offerItems).map((offer) => (
                <div className="offer-card" key={offer.id}>
                  <img src={offer.image} alt={offer.title} loading="lazy" />
                  <div className="discount-badge">{offer.discount}</div>
                  {offer.badge && (
                    <div className="special-badge">{offer.badge}</div>
                  )}
                  <div className="offer-info">
                    <span>{offer.restaurant}</span>
                    <h4>{offer.title}</h4>
                    <div className="offer-pricing">
                      <span className="offer-price">{offer.price}</span>
                      {offer.originalPrice && (
                        <span className="original-price">
                          {offer.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="plus-icon" aria-label="Add to cart">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items on Offer */}
          <div className="menu-section">
            <h3 className="menu-category-title">Popular Items</h3>
            <div className="compact-menu-grid">
              {specialOfferItems.map((item) => (
                <div className="compact-menu-card" key={item.id}>
                  <div className="card-content">
                    <div className="item-info">
                      <h4 className="item-title">{item.title}</h4>
                      <div className="chili-rating">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`chili ${index < (item.spiceLevel || 3) ? "filled" : "empty"}`}
                          >
                            🌶️
                          </span>
                        ))}
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
                            <span className="xl-price">
                              {item.xlOption.price}
                            </span>
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
                      {item.promoText && (
                        <div className="promo-overlay">{item.promoText}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offers Information */}
      <div className="delivery-info-section">
        <div className="delivery-info-grid">
          <div className="delivery-info-card">
            <h3>🎯 Current Offers</h3>
            <div className="info-item">
              <span className="label">Active Promotions:</span>
              <span className="value">{offerItems.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Maximum Discount:</span>
              <span className="value">Up to 100%</span>
            </div>
            <div className="info-item">
              <span className="label">Popular Items:</span>
              <span className="value">{specialOfferItems.length}</span>
            </div>
            <div className="info-item highlight">
              <span className="label">⏱️ Valid Until:</span>
              <span className="value">End of Month</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>📋 Terms & Conditions</h3>
            <div className="info-item">
              <span className="label">Minimum Order:</span>
              <span className="value">{restaurantInfo.minOrder}</span>
            </div>
            <div className="info-item">
              <span className="label">Delivery Area:</span>
              <span className="value">London & Surrounding Areas</span>
            </div>
            <div className="info-item">
              <span className="label">Valid For:</span>
              <span className="value">New & Existing Customers</span>
            </div>
            <div className="info-item">
              <span className="label">Combination:</span>
              <span className="value">
                Cannot be combined with other offers
              </span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>💡 How to Use</h3>
            <div className="info-item">
              <span className="label">Step 1:</span>
              <span className="value">Browse available offers</span>
            </div>
            <div className="info-item">
              <span className="label">Step 2:</span>
              <span className="value">Add items to your cart</span>
            </div>
            <div className="info-item">
              <span className="label">Step 3:</span>
              <span className="value">Discount applied automatically</span>
            </div>
            <div className="info-item">
              <span className="label">Step 4:</span>
              <span className="value">Complete your order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>🛒 Ready to Order?</h3>
        </div>
        <div className="reviews-grid">
          <div className="review-card stats-card">
            <div className="stats-content">
              <h4>🎁 First Order</h4>
              <span className="stats-number">20% OFF</span>
              <p>New customers get 20% off their first order</p>
            </div>
          </div>
          <div className="review-card stats-card">
            <div className="stats-content">
              <h4>🚚 Free Delivery</h4>
              <span className="stats-number">Over £15</span>
              <p>Free delivery on orders over £15</p>
            </div>
          </div>
          <div className="review-card stats-card">
            <div className="stats-content">
              <h4>⏰ Fast Service</h4>
              <span className="stats-number">20-25 min</span>
              <p>Quick delivery to your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
