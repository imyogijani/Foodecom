/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./restaurant.css";
import "./HomeLayout.css";
import McD from "../../images/McD.png";
import papajohn from "../../images/Papajohns.png";
import kfc from "../../images/KFC.png";
import texasChicken from "../../images/Tex.png";
import burgerKing from "../../images/Bking.png";
import shaurma from "../../images/shaurma.png";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

// Minimal E-mall sample data
const mallInfo = {
  name: "E-Mall World Shopping Center",
  minOrder: "$0.00",
  deliveryTime: "1-3 Business Days",
  phone: "+1-800-EMALL",
  website: "https://e-mallworld.com",
  address: "Global Online Shopping Mall",
  operationalHours: {
    monday: "12:00 AM–3:00 AM, 8:00 AM–3:00 AM",
    tuesday: "8:00 AM–3:00 AM",
    wednesday: "8:00 AM–3:00 AM",
    thursday: "8:00 AM–3:00 AM",
    friday: "8:00 AM–3:00 AM",
    saturday: "8:00 AM–3:00 AM",
    sunday: "8:00 AM–12:00 AM",
  },
  reviews: 1240, // <-- Added to prevent undefined error
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
    {
      id: "offer-1",
      title: "10% Off Electronics",
      image:
        "https://images.pexels.com/photos/1054397/pexels-photo-1054397.jpeg?auto=compress&w=400",
      discount: "-10%",
      store: "ElectroStore",
      badge: "NEW",
    },
    {
      id: "offer-2",
      title: "Buy 1 Get 1 Free Clothing",
      image:
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400",
      discount: "B1G1",
      store: "FashionHub",
      badge: "HOT",
    },
  ],
  Electronics: [
    {
      id: "el-1",
      title: "Smartphone X",
      desc: "Latest smartphone with advanced features",
      image:
        "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400",
      price: "$499",
      isPopular: true,
    },
    {
      id: "el-2",
      title: "Wireless Headphones",
      desc: "Noise-cancelling over-ear headphones",
      image:
        "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=400",
      price: "$99",
    },
  ],
  Clothing: [
    {
      id: "cl-1",
      title: "Men's T-Shirt",
      desc: "100% cotton, various sizes",
      image:
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400",
      price: "$19",
    },
    {
      id: "cl-2",
      title: "Women's Dress",
      desc: "Elegant evening dress",
      image:
        "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=400",
      price: "$49",
    },
  ],
  "Home Appliances": [
    {
      id: "ha-1",
      title: "Blender Pro",
      desc: "Multi-speed kitchen blender",
      image:
        "https://images.pexels.com/photos/3768169/pexels-photo-3768169.jpeg?auto=compress&w=400",
      price: "$59",
    },
  ],
  Books: [
    {
      id: "bk-1",
      title: "Bestseller Novel",
      desc: "A thrilling mystery novel",
      image:
        "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400",
      price: "$12",
    },
  ],
  Toys: [
    {
      id: "ty-1",
      title: "Building Blocks Set",
      desc: "Creative play for kids",
      image:
        "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg?auto=compress&w=400",
      price: "$25",
    },
  ],
};

const getItemsByCategory = (category) => mallItemsByCategory[category] || [];

const reviews = [
  {
    id: 1,
    name: "Alice",
    rating: 5,
    date: "2024-06-01",
    verified: true,
    text: "Great selection and fast delivery!",
  },
  {
    id: 2,
    name: "Bob",
    rating: 4,
    date: "2024-06-02",
    verified: false,
    text: "Good prices on electronics.",
  },
];

export default function Shops() {
  const [activeTab, setActiveTab] = useState("Offers");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const similarRestaurants = [
    { name: "McDonald's London", img: McD },
    { name: "Papa Johns", img: papajohn },
    { name: "KFC West London", img: kfc },
    { name: "Texas Chicken", img: texasChicken },
    { name: "Burger King", img: burgerKing },
    { name: "Shaurma 1", img: shaurma },
  ];

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    // Fetch products and categories for product section
    const fetchProductsAndCategories = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("/api/category/get-category-with-shop-count"),
          axios.get(
            "/api/products?populateCategory=true&populateSubcategory=true"
          ),
        ]);
        const categoriesData = catRes.data.categories || [];
        setCategories(categoriesData);
        if (categoriesData.length > 0)
          setActiveCategory(categoriesData[0].name);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, []);

  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    if (activeCategory) {
      filtered = filtered.filter(
        (p) => p.category && p.category.name === activeCategory
      );
    }
    if (sortBy === "low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, activeCategory, sortBy]);

  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderOffers = (items) => {
    return (
      <div className="offers-grid">
        {items.map((offer) => (
          <div
            className="offer-card compact-menu-card"
            key={offer.id}
            onClick={() => navigate(`/product/${offer.id}`, { state: { item: offer } })}
            onMouseEnter={() => setHoveredItem(offer.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ position: "relative" }}
          >
            <div className="card-content">
              <div className="circular-image">
                <img src={offer.image} alt={offer.title} loading="lazy" />
                {offer.badge && <div className="popular-badge">{offer.badge}</div>}
              </div>
              <div className="item-title-wrapper">
                <h4 className="item-title">{offer.title}</h4>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={e => { e.stopPropagation(); addToCart({ ...offer, quantity: 1, addedAt: new Date().toISOString() }); }}
                aria-label={`Add ${offer.title} to cart`}
              >
                +
              </button>
            </div>
            {hoveredItem === offer.id && (
              <div className="product-popup">
                <p className="popup-price">{offer.price}</p>
                <p className="popup-desc">{offer.discount} {offer.store}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMenuItems = (items) => {
    return (
      <div className="compact-menu-grid">
        {items.map((item) => (
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
                {item.isPopular && <div className="popular-badge">🔥 Popular</div>}
              </div>
              <div className="item-title-wrapper">
                <h4 className="item-title">{item.title}</h4>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={e => { e.stopPropagation(); addToCart({ ...item, quantity: 1, addedAt: new Date().toISOString() }); }}
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

  // Optionally, you can show a summary using cartItems from useCart if needed

  return (
    <div className="home-layout-container restaurant-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{mallInfo.name}</h1>
            <div className="hero-tags">
              <span className="tag">Minimum Order: {mallInfo.minOrder}</span>
              <span className="tag">Delivery in {mallInfo.deliveryTime}</span>
            </div>
          </div>
          <div className="hero-image"></div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="restaurant-menu">
        <div className="menu-header">
          <h2>All Offers from {mallInfo.name}</h2>
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
          {mallCategories.map((cat) => (
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

      {/* Product Section */}
      <div className="featured-products-container">
        <h3 style={{ marginBottom: 16 }}>Featured Products</h3>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontWeight: 500,
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontWeight: 500,
            }}
            defaultValue=""
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
        <div className="product-cards-wrapper">
          <div className="product-cards">
            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <div
                className="under-development-section"
                style={{
                  padding: "32px",
                  textAlign: "center",
                  background: "#f8f9fa",
                  borderRadius: 12,
                  color: "#888",
                  fontWeight: 600,
                  fontSize: 20,
                  margin: "32px 0",
                  width: "100%",
                }}
              >
                🚧 This section is under development 🚧
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  className="compact-menu-card"
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`, { state: { item: product } })}
                  onMouseEnter={() => setHoveredItem(product._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ position: "relative" }}
                >
                  <div className="card-content">
                    <div className="circular-image">
                      <img
                        src={
                          product.image
                            ? product.image.startsWith("/uploads")
                              ? `http://localhost:8080${product.image}`
                              : product.image
                            : "placeholder.jpg"
                        }
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="item-title-wrapper">
                      <h4 className="item-title">{product.name}</h4>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={e => { e.stopPropagation(); addToCart({ ...product, quantity: 1, addedAt: new Date().toISOString() }); }}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                  {hoveredItem === product._id && (
                    <div className="product-popup">
                      <p className="popup-price">₹{product.price}</p>
                      <p className="popup-desc">{product.desc}</p>
                    </div>
                  )}
                </div>
              ))
            )}
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
              <span className="value">{mallInfo.operationalHours.monday}</span>
            </div>
            <div className="info-item">
              <span className="label">Tuesday:</span>
              <span className="value">{mallInfo.operationalHours.tuesday}</span>
            </div>
            <div className="info-item">
              <span className="label">Wednesday:</span>
              <span className="value">
                {mallInfo.operationalHours.wednesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Thursday:</span>
              <span className="value">
                {mallInfo.operationalHours.thursday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Friday:</span>
              <span className="value">{mallInfo.operationalHours.friday}</span>
            </div>
            <div className="info-item">
              <span className="label">Saturday:</span>
              <span className="value">
                {mallInfo.operationalHours.saturday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Sunday:</span>
              <span className="value">{mallInfo.operationalHours.sunday}</span>
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
              <span className="value">{mallInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">🌐 Website:</span>
              <span className="value">{mallInfo.website}</span>
            </div>
          </div>

          <div className="delivery-info-card">
            <h3>⏰ Operational Times</h3>
            <div className="info-item">
              <span className="label">Monday:</span>
              <span className="value">{mallInfo.operationalHours.monday}</span>
            </div>
            <div className="info-item">
              <span className="label">Tuesday:</span>
              <span className="value">{mallInfo.operationalHours.tuesday}</span>
            </div>
            <div className="info-item">
              <span className="label">Wednesday:</span>
              <span className="value">
                {mallInfo.operationalHours.wednesday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Thursday:</span>
              <span className="value">
                {mallInfo.operationalHours.thursday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Friday:</span>
              <span className="value">{mallInfo.operationalHours.friday}</span>
            </div>
            <div className="info-item">
              <span className="label">Saturday:</span>
              <span className="value">
                {mallInfo.operationalHours.saturday}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Sunday:</span>
              <span className="value">{mallInfo.operationalHours.sunday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-container">
          <div className="map-info">
            <div className="restaurant-location-card">
              <h3>📍 {mallInfo.name}</h3>
              <p>South London</p>
              <p>{mallInfo.address}</p>
              <div className="location-tags">
                <span className="tag">📞 Phone: {mallInfo.phone}</span>
                <span className="tag">🌐 Website: {mallInfo.website}</span>
              </div>
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-overlay">
              <p>🗺️ Interactive Map</p>
              <p>{mallInfo.name} Location</p>
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
              <p className="review-comment">{review.text}</p>
              <div className="review-actions">
                <button className="helpful-btn">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="overall-rating">
          <span className="rating-number-large">{mallInfo.rating}</span>
          <div className="rating-details">
            <div className="rating-stars-large">
              {renderStars(Math.floor(mallInfo.rating))}
            </div>
            <span className="rating-count">
              {mallInfo.reviews.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Similar Restaurants */}
      <div className="similar-restaurants">
        <h3>Similar Restaurants</h3>
        <div className="restaurants-grid">
          {similarRestaurants.map((restaurant) => (
            <div className="restaurant-brand-card" key={restaurant.name}>
              <img src={restaurant.img} alt={restaurant.name} loading="lazy" />
              <span className="restaurant-name">{restaurant.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
