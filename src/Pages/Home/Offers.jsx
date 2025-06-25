/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./restaurant.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// Minimal E-mall sample data
const mallInfo = {
  name: "E-Mall World Shopping Center",
  minOrder: "$0.00",
};

const offerItems = [
  { id: "offer-1", title: "10% Off Electronics", image: "https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&w=400", discount: "-10%", store: "ElectroStore", badge: "NEW", price: "$450", originalPrice: "$500" },
  { id: "offer-2", title: "Buy 1 Get 1 Free Clothing", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", discount: "B1G1", store: "FashionHub", badge: "HOT", price: "$19", originalPrice: "$38" },
];

const getAllMallItems = () => [
  { id: "el-1", title: "Smartphone X", desc: "Latest smartphone", image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400", price: "$499", isPopular: true, spiceLevel: 0 },
  { id: "cl-1", title: "Men's T-Shirt", desc: "100% cotton", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400", price: "$19", isPopular: true, spiceLevel: 0 },
];

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const filterOffers = (offers) => {
    if (!searchQuery) return offers;
    return offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.store.toLowerCase().includes(searchQuery.toLowerCase())
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
  const specialOfferItems = getAllMallItems()
    .filter(
      (item) => item.isPopular
    )
    .slice(0, 6);

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{mallInfo.name}</h1>
            <div className="hero-tags">
              <span className="tag">Limited Time Offers</span>
              <span className="tag">Great Savings</span>
            </div>
          </div>
          <div className="hero-image">
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>All Special Offers from {mallInfo.name}</h2>
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
                    <span>{offer.store}</span>
                    <h4>{offer.title}</h4>
                    <div className="offer-pricing">
                      <span className="offer-price">{offer.price}</span>
                      {offer.originalPrice && (
                        <span className="original-price">
                          {offer.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      className="plus-icon"
                      aria-label="Add to cart"
                      onClick={() =>
                        addToCart({
                          id: offer.id,
                          name: offer.title,
                          price: parseFloat(
                            (offer.price || "0")
                              .toString()
                              .replace(/[₹INR\s]/g, "")
                          ),
                          image: offer.image,
                        })
                      }
                    >
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
                    <h4 className="item-title">{item.title}</h4>
                    <div className="item-hover-details">
                      <div className="item-description">{item.desc}</div>
                      <div className="item-price">{item.price}</div>
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
              <span className="value">{mallInfo.minOrder}</span>
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
              <span className="stats-number">Over ₹15</span>
              <p>Free delivery on orders over ₹15</p>
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
