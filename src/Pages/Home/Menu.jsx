import React, { useState, useEffect } from "react";
import "./Menu.css";
import "./HomeLayout.css";
import "./theme-override.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Search,
  ChevronDown,
  Truck,
  Shield,
} from "lucide-react";

// Mall info configuration
const mallInfo = {
  name: "E-Mall World",
  description: "Your trusted online shopping destination",
  rating: 4.6,
  reviews: 125000,
  minOrder: "₹0",
  deliveryTime: "Same Day Delivery",
  phone: "+1-800-EMALL",
  website: "https://e-mallworld.com",
  address: "Serving Worldwide",
};

// Categories list
const mallCategories = [];

// Product data store
const mallItemsByCategory = {};

const getItemsByCategory = (category) => mallItemsByCategory[category] || [];
const getAllMallItems = () => Object.values(mallItemsByCategory).flat();

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filterAndSortItems = (items) => {
    if (!items) return [];

    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter((item) => {
      const price = parseInt(item.price.replace(/[₹,]/g, ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseInt(a.price.replace(/[₹,]/g, "")) -
            parseInt(b.price.replace(/[₹,]/g, ""))
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseInt(b.price.replace(/[₹,]/g, "")) -
            parseInt(a.price.replace(/[₹,]/g, ""))
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 4.0) - (a.rating || 4.0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({
      ...item,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
    toast.success(`${item.title} added to cart! 🛒`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="star-filled" size={14} fill="currentColor" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="star-half" size={14} fill="currentColor" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-empty" size={14} />);
    }

    return stars;
  };

  const ProductCard = ({ item, isListView = false }) => (
    <div
      className={`modern-product-card ${isListView ? "list-view" : ""}`}
      onClick={() => navigate(`/product/${item.id}`, { state: { item } })}
    >
      <div className="product-image-wrapper">
        <img src={item.image} alt={item.title} loading="lazy" />
        {item.discount && (
          <div className="discount-label">-{item.discount}%</div>
        )}
        {item.prime && <div className="prime-badge">Prime</div>}
      </div>

      <div className="product-details">
        <h3 className="product-name">{item.title}</h3>
        <p className="product-description">{item.desc}</p>

        <div className="product-rating-row">
          <div className="rating-stars">{renderStars(item.rating || 4.0)}</div>
          <span className="rating-value">{item.rating || 4.0}</span>
          <span className="review-count">({item.reviews || 0})</span>
        </div>

        <div className="pricing-section">
          <span className="current-price">{item.price}</span>
          {item.originalPrice && (
            <span className="original-price">{item.originalPrice}</span>
          )}
          {item.discount && (
            <span className="discount-percent">({item.discount}% off)</span>
          )}
        </div>

        <div className="delivery-info">
          {item.freeDelivery && (
            <span className="free-delivery">
              <Truck size={14} />
              FREE Delivery
            </span>
          )}
          <span className="delivery-date">Get it by tomorrow</span>
        </div>

        <button
          className="add-cart-button"
          onClick={(e) => handleAddToCart(e, item)}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      );
    }

    const items = getItemsByCategory(activeTab);
    const filteredItems = filterAndSortItems(items);

    if (filteredItems.length === 0) {
      return (
        <div className="under-development">
          <h3>🚧 Products Coming Soon! 🚧</h3>
          <p>We're working hard to bring you amazing products</p>
        </div>
      );
    }

    return (
      <div className={`products-container ${viewMode}`}>
        {filteredItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            isListView={viewMode === "list"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="modern-menu-page">
      <div className="menu-header-section">
        <div className="mall-info">
          <h1>{mallInfo?.name}</h1>
          <div className="mall-meta">
            <div className="rating-badge">
              <Star className="star-icon" size={16} fill="currentColor" />
              <span>{mallInfo?.rating}</span>
              <span>({mallInfo?.reviews?.toLocaleString()} reviews)</span>
            </div>
            <div className="delivery-badge">
              <Truck size={16} />
              <span>{mallInfo?.deliveryTime}</span>
            </div>
            <div className="security-badge">
              <Shield size={16} />
              <span>Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <button
            className="filter-toggle"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={filterOpen ? "rotated" : ""} />
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="reviews">Most Reviewed</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
                }
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      )}

      <div className="category-navigation">
        <div className="category-tabs">
          {mallCategories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-section">{renderContent()}</div>

      <div className="info-cards-section">
        <div className="info-cards-grid">
          <div className="info-card">
            <h3>📋 Catalog Info</h3>
            <div className="info-item">
              <span className="label">Categories:</span>
              <span className="value">{mallCategories.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Products:</span>
              <span className="value">{getAllMallItems().length}</span>
            </div>
            <div className="info-item">
              <span className="label">Prime Products:</span>
              <span className="value">
                {getAllMallItems().filter((item) => item?.prime).length}
              </span>
            </div>
          </div>

          <div className="info-card">
            <h3>⭐ Quality Assurance</h3>
            <div className="info-item">
              <span className="label">Average Rating:</span>
              <span className="value">4.6/5</span>
            </div>
            <div className="info-item">
              <span className="label">Verified Reviews:</span>
              <span className="value">
                {mallInfo?.reviews?.toLocaleString()}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Return Policy:</span>
              <span className="value">30 Days</span>
            </div>
          </div>

          <div className="info-card">
            <h3>🚚 Delivery & Support</h3>
            <div className="info-item">
              <span className="label">Delivery Time:</span>
              <span className="value">{mallInfo?.deliveryTime}</span>
            </div>
            <div className="info-item">
              <span className="label">Support:</span>
              <span className="value">24/7 Available</span>
            </div>
            <div className="info-item">
              <span className="label">Locations:</span>
              <span className="value">Pan India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
