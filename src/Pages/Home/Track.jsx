import React, { useState, useEffect } from "react";
import "./restaurant.css";
import "./Track.css";
import {
  restaurantInfo,
  menuCategories,
  getItemsByCategory,
  defaultBasketItems,
  reviews,
} from "../../data/menuData";

export default function Track() {
  const [activeTab, setActiveTab] = useState("Pizzas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [basketItems, setBasketItems] = useState(defaultBasketItems);

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

  const addToBasket = (item, size = null) => {
    const newItem = {
      id: Date.now(),
      name: item.title,
      desc: item.desc ? item.desc.substring(0, 30) + "..." : "",
      price: size
        ? parseFloat(size.price.replace("£", ""))
        : parseFloat(item.price.replace(/[£GBP\s]/g, "")),
      quantity: 1,
    };
    setBasketItems((prev) => [...prev, newItem]);
  };

  const removeFromBasket = (itemId) => {
    setBasketItems((prev) => prev.filter((item) => item.id !== itemId));
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
              <button
                className="plus-icon"
                onClick={() => addToBasket(offer)}
                aria-label="Add to basket"
              >
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
                        onClick={() => addToBasket(item, size)}
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
                    <button
                      className="xl-btn"
                      onClick={() => addToBasket(item, item.xlOption)}
                    >
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
                  <button
                    className="add-btn"
                    onClick={() => addToBasket(item)}
                    aria-label="Add to basket"
                  >
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

  const subtotal = basketItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = 3.0;
  const deliveryFee = 2.5;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="track-page">
      {/* Hero Section - Exact match to screenshot */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-subtitle">
              Desi Flavours with a blend of Italian aesthetics!
            </p>
            <h1>Tandoori Pizza London</h1>
            <div className="hero-tags">
              <span className="tag minimum-order">
                <span className="tag-icon">💳</span>
                Minimum Order: 12 GBP
              </span>
              <span className="tag delivery-time">
                <span className="tag-icon">🚲</span>
                Delivery in 20-25 Minutes
              </span>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="hero-image-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F211d078ff6a446edab27a1ec97a1df43%2Fb43d46a8059b4ee0868ad7a2a6b79750?format=webp&width=800"
                alt="Woman eating pizza"
                className="hero-main-image"
                loading="eager"
              />
            </div>
            <div className="rating-badge">
              <span className="rating-number">3.4</span>
              <div className="rating-stars">{renderStars(3)}</div>
              <span className="rating-count">1,360 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orange Banner */}
      <div className="orange-banner">
        <span className="banner-icon">🕐</span>
        <span>Open until 3:00 AM</span>
      </div>

      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>Order from Tandoori Pizza London</h2>
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

        <div className="menu-content-container">
          {/* Left Sidebar Menu */}
          <div className="menu-sidebar">
            <div className="menu-header-sidebar">
              <div className="menu-icon">📋</div>
              <span>Menu</span>
            </div>
            <div className="menu-categories">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  className={`menu-category ${activeTab === category ? "active" : ""}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="menu-main-content">
            <div className="content-header">
              <h3 className="content-title">{activeTab}</h3>
              <div className="sort-section">
                <span>Sort by Pricing</span>
                <div className="sort-icon">⚙️</div>
              </div>
            </div>

            <div className="menu-content">{renderContent()}</div>
          </div>

          {/* Right Sidebar - My Basket */}
          <div className="basket-sidebar">
            <div className="basket-header">
              <div className="basket-icon">🛒</div>
              <span>My Basket</span>
            </div>

            <div className="basket-content">
              <div className="basket-items">
                {basketItems.map((item) => (
                  <div key={item.id} className="basket-item">
                    <div className="item-quantity">{item.quantity}</div>
                    <div className="item-details">
                      <h5>{item.name}</h5>
                      {item.desc && <p>{item.desc}</p>}
                    </div>
                    <div className="item-price">£{item.price.toFixed(2)}</div>
                    <div
                      className="item-remove"
                      onClick={() => removeFromBasket(item.id)}
                    >
                      ❌
                    </div>
                  </div>
                ))}
              </div>

              <div className="basket-summary">
                <div className="summary-row">
                  <span>Sub Total:</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Discounts:</span>
                  <span>-{discount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="total-section">
                <div className="total-to-pay">
                  <span>Total to pay</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <div className="free-item-note">Choose your free item..</div>
                <div className="coupon-note">Apply Coupon Code here</div>
              </div>

              <div className="delivery-options">
                <div className="delivery-option">
                  <div className="delivery-icon">🚚</div>
                  <div>
                    <strong>Delivery</strong>
                    <div>Starts at 17:50</div>
                  </div>
                </div>
                <div className="collection-option">
                  <div className="collection-icon">🏪</div>
                  <div>
                    <strong>Collection</strong>
                    <div>Starts at 16:50</div>
                  </div>
                </div>
              </div>

              <button className="checkout-btn">Checkout!</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="delivery-info-section">
        <div className="delivery-info-grid">
          <div className="delivery-info-card">
            <h3>🚚 Delivery Information</h3>
            <div className="info-item">
              <span className="label">Monday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.monday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Tuesday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.tuesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Wednesday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.wednesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Thursday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.thursday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Friday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.friday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Saturday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.saturday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Sunday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.sunday}
              </span>
            </div>
            <div className="info-item highlight">
              <span className="label">⏱️ Estimated delivery:</span>
              <span className="value">20 min</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>📞 Contact Information</h3>
            <div className="info-item">
              <span className="label">
                Support team available on chat delivery
              </span>
              <span className="value">
                representing phone contact for restaurant. The
              </span>
            </div>
            <div className="info-item">
              <span className="label">Information upon request:</span>
              <span className="value"></span>
            </div>
            <div className="info-item">
              <span className="label">📱 Phone number:</span>
              <span className="value">{restaurantInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">🌐 Website:</span>
              <span className="value">{restaurantInfo.website}</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>⏰ Operational Times</h3>
            <div className="info-item">
              <span className="label">Monday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.monday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Tuesday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.tuesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Wednesday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.wednesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Thursday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.thursday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Friday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.friday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Saturday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.saturday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Sunday:</span>
              <span className="value">
                {restaurantInfo.operationalHours.sunday}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-container">
          <div className="map-info">
            <div className="restaurant-location-card">
              <h3>📍 {restaurantInfo.name}</h3>
              <p>London Location</p>
              <p>{restaurantInfo.address}</p>
              <div className="location-tags">
                <span className="tag">📞 Phone: {restaurantInfo.phone}</span>
                <span className="tag">
                  🌐 Website: {restaurantInfo.website}
                </span>
              </div>
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-overlay">
              <p>🗺️ Interactive Map</p>
              <p>{restaurantInfo.name} Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>⭐ Customer Reviews</h3>
          <div className="navigation-arrows">
            <button className="nav-arrow prev">&lt;</button>
            <button className="nav-arrow next">&gt;</button>
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <span>{review.name.charAt(0)}</span>
                  </div>
                  <div className="reviewer-details">
                    <h4>
                      {review.name}
                      {review.verified && (
                        <span className="verified-badge">✓</span>
                      )}
                    </h4>
                    <p>{review.date}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-actions">
                <button className="helpful-btn">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="overall-rating">
          <span className="rating-number-large">3.4</span>
          <div className="rating-details">
            <div className="rating-stars-large">{renderStars(3)}</div>
            <span className="rating-count">1,360 reviews</span>
          </div>
        </div>
      </div>

      {/* Similar Restaurants */}
      <div className="similar-restaurants">
        <h3>Similar Restaurants</h3>
        <div className="restaurants-grid">
          <div className="restaurant-brand-card mcdonalds">
            <img
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="McDonald's"
              loading="lazy"
            />
            <span className="restaurant-name">McDonald's London</span>
          </div>
          <div className="restaurant-brand-card papa-johns">
            <img
              src="https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Papa Johns"
              loading="lazy"
            />
            <span className="restaurant-name">Papa Johns</span>
          </div>
          <div className="restaurant-brand-card kfc">
            <img
              src="https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="KFC"
              loading="lazy"
            />
            <span className="restaurant-name">KFC West London</span>
          </div>
          <div className="restaurant-brand-card texas-chicken">
            <img
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Texas Chicken"
              loading="lazy"
            />
            <span className="restaurant-name">Texas Chicken</span>
          </div>
          <div className="restaurant-brand-card burger-king">
            <img
              src="https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Burger King"
              loading="lazy"
            />
            <span className="restaurant-name">Burger King</span>
          </div>
          <div className="restaurant-brand-card shaurma">
            <img
              src="https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Shaurma"
              loading="lazy"
            />
            <span className="restaurant-name">Shaurma 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
