import React, { useState, useEffect } from "react";
import "./restaurant.css";
import {
  restaurantInfo,
  menuCategories,
  getItemsByCategory,
  defaultBasketItems,
  reviews,
  similarRestaurants,
} from "../../data/menuData";

export default function Restaurants() {
  const [activeTab, setActiveTab] = useState("Offers");
  const [cartItems, setCartItems] = useState(defaultBasketItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const addToCart = (item, size = null) => {
    const newItem = {
      id: Date.now(),
      name: item.title,
      desc: item.desc ? item.desc.substring(0, 30) + "..." : "",
      price: size
        ? parseFloat(size.price.replace("£", ""))
        : parseFloat(item.price.replace(/[£GBP\s]/g, "")),
      quantity: 1,
    };
    setCartItems((prev) => [...prev, newItem]);
    console.log(`Added ${item.title} to cart`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()),
    );
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
                onClick={() => addToCart(offer)}
                aria-label="Add to cart"
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
                        onClick={() => addToCart(item, size)}
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
                      onClick={() => addToCart(item, item.xlOption)}
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
                    onClick={() => addToCart(item)}
                    aria-label="Add to cart"
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
          <p>Loading delicious items...</p>
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = 3.0;
  const deliveryFee = 2.5;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{restaurantInfo.name}</h1>
            <div className="hero-tags">
              <span className="tag">
                Minimum Order: {restaurantInfo.minOrder}
              </span>
              <span className="tag">
                Delivery in {restaurantInfo.deliveryTime}
              </span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/7192147/pexels-photo-7192147.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt={`${restaurantInfo.name} restaurant`}
              loading="eager"
            />
          </div>
        </div>
        <div className="rating-badge">
          <span className="rating-number">{restaurantInfo.rating}</span>
          <div className="rating-stars">
            {renderStars(Math.floor(restaurantInfo.rating))}
          </div>
          <span className="rating-count">
            {restaurantInfo.reviews.toLocaleString()} reviews
          </span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>All Offers from {restaurantInfo.name}</h2>
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
              <span className="label">Dietary restrictions:</span>
              <span className="value">
                Please contact the restaurant. We provide food-specific
                information upon request.
              </span>
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
              <p>South London</p>
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
          <span className="rating-number-large">{restaurantInfo.rating}</span>
          <div className="rating-details">
            <div className="rating-stars-large">
              {renderStars(Math.floor(restaurantInfo.rating))}
            </div>
            <span className="rating-count">
              {restaurantInfo.reviews.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Similar Restaurants */}
      <div className="similar-restaurants">
        <h3>Similar Restaurants</h3>
        <div className="restaurants-grid">
          {similarRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-brand-card">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                loading="lazy"
              />
              <span className="restaurant-name">{restaurant.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-content">
            <span className="cart-count">{cartItems.length} items in cart</span>
            <button className="view-cart-btn">View Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}
