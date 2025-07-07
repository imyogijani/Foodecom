import "./Home.css";
import "./HomeLayout.css";
import "./theme-override.css";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import BottomCard from "./BottomCard";
import { useCart } from "../../context/CartContext";
import DealsList from "./DealsList";
import {
  Star,
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Shield,
  RefreshCw,
  Award,
} from "lucide-react";

export default function Home() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [deals, setDeals] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    if (activeCategory) {
      filtered = filtered.filter(
        (p) => p.category && p.category.name === activeCategory
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort(
        (a, b) => (b.rating || 4.5) - (a.rating || 4.5)
      );
    }
    return filtered;
  }, [products, activeCategory, sortBy, searchQuery]);

  const handleGetStarted = () => {
    window.location.href = "/menu";
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchDeals(),
          // fetchOffers(), // Removed to prevent race condition
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "/api/category/get-category-with-shop-count"
      );
      const categoriesData = response.data.categories || [];
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setActiveCategory(categoriesData[0].name);
      }

      const subCategoriesMap = {};
      categoriesData.forEach((category) => {
        subCategoriesMap[category._id] = category.children || [];
      });
      setSubcategories(subCategoriesMap);
    } catch (error) {
      console.error("Category fetch error:", error);
      toast.error("Error fetching categories");
      setCategories([]);
      setSubcategories({});
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "/api/products?populateCategory=true&populateSubcategory=true"
      );
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      // Use absolute URL to avoid baseURL/proxy issues
      const offersRes = await axios.get(
        "http://localhost:8080/api/offers/today"
      );
      const offers = offersRes.data.offers || [];
      // Map offers to deal-like objects for display
      const mappedOffers = offers.map((offer) => {
        let image = offer.product?.image;
        // Fix: handle both relative and absolute image URLs
        if (image && image.startsWith("/uploads")) {
          image = `http://localhost:8080${image}`;
        } else if (!image || image === "") {
          image = "/images/offer1.png"; // fallback to a local default offer image
        }
        return {
          _id: offer._id,
          title: offer.title || offer.product?.name || "Today's Offer",
          description:
            offer.description ||
            offer.product?.description ||
            "Special offer for today only!",
          image,
          dealPrice:
            offer.price ||
            (offer.product?.price
              ? Math.round(
                  offer.product.price * (1 - (offer.discount || 0) / 100)
                )
              : undefined),
          originalPrice: offer.product?.price || offer.price,
          discountPercentage: offer.discount || 0,
          shopName:
            offer.shop?.shopName ||
            offer.shop?.names ||
            offer.shop?.email ||
            "Shop",
          isOffer: true,
          // Add fallback fields for UI compatibility
          rating: offer.product?.rating || 4.5,
          reviewCount: offer.product?.reviewCount || 100,
        };
      });
      // Fetch regular deals as before
      const response = await axios.get("/api/deals/active");
      const allDeals = [...mappedOffers, ...(response.data.deals || [])];
      setDeals(allDeals);
      console.log("Today's Deals (offers + deals):", allDeals);
    } catch (error) {
      console.error("Deals fetch error:", error);
      setDeals([]);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
    toast.success(`${product.name || product.title} added to cart! 🛒`);
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

  const ProductCard = ({ product }) => (
    <div className="card-base card-large product-card">
      <div className="card-image-container">
        <img
          src={
            product.image ||
            "https://images.pexels.com/photos/6214360/pexels-photo-6214360.jpeg"
          }
          alt={product.name}
          className="card-image"
          loading="lazy"
        />
      </div>

      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <div className="product-rating" style={{ margin: "6px 0" }}>
          <div className="stars">{renderStars(product.rating || 4.5)}</div>
          <span
            className="rating-count"
            style={{ fontSize: "11px", color: "#0066cc" }}
          >
            ({product.reviewCount || Math.floor(Math.random() * 500) + 50})
          </span>
        </div>

        <div className="card-description" style={{ margin: "6px 0" }}>
          <span
            className="current-price"
            style={{ fontSize: "16px", fontWeight: "600", color: "#232f3e" }}
          >
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span
              className="original-price"
              style={{
                fontSize: "12px",
                color: "#666",
                textDecoration: "line-through",
                marginLeft: "8px",
              }}
            >
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {product.discount && (
          <div
            style={{ color: "#ff4757", fontSize: "12px", margin: "0 0 6px 0" }}
          >
            -{product.discount}% OFF
          </div>
        )}

        <div style={{ margin: "6px 0", fontSize: "10px" }}>
          <span
            className="prime-badge"
            style={{
              background: "#0066cc",
              color: "white",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "9px",
              marginRight: "6px",
            }}
          >
            Prime
          </span>
          <span
            className="free-delivery"
            style={{ color: "#007600", fontSize: "10px" }}
          >
            FREE Delivery
          </span>
        </div>

        <div className="card-actions">
          <button
            className="card-button"
            onClick={() => handleAddToCart(product)}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="amazon-home-container">
      {/* Hero Section */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to E-Mall World</h1>
            <p>Discover millions of products from thousands of brands</p>
            <div className="hero-search-bar">
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                />
                <button className="search-btn">Search</button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/6214360/pexels-photo-6214360.jpeg"
              alt="Shopping Experience"
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="trust-badge">
          <Truck size={24} />
          <span>Fast Delivery</span>
        </div>
        <div className="trust-badge">
          <Shield size={24} />
          <span>Secure Payment</span>
        </div>
        <div className="trust-badge">
          <RefreshCw size={24} />
          <span>Easy Returns</span>
        </div>
        <div className="trust-badge">
          <Award size={24} />
          <span>Quality Assured</span>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>Shop by Category</h2>
        <div className="cards-grid cards-grid-medium">
          {categories.map((cat) => (
            <div
              className="card-base card-medium category-card"
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="card-image-container">
                <img
                  src={
                    cat.image
                      ? `http://localhost:8080${cat.image}`
                      : "https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg"
                  }
                  alt={cat.name}
                  className="card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg";
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{cat.name}</h3>
                <p className="card-subtitle">{cat.shopCount || 0} stores</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="filter-sort-bar">
        <div className="filter-options">
          <Filter size={18} />
          <span>Filter by:</span>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-options">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="">Relevance</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Featured Products */}
      <div className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked items just for you</p>
        </div>

        {loading ? (
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
        ) : (
          <div className="cards-grid cards-grid-large">
            {filteredProducts.slice(0, 12).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Debug: Show loaded deals/offers for troubleshooting
      <div
        style={{
          background: "#fffbe6",
          color: "#b36b00",
          padding: "8px",
          margin: "16px 0",
          fontSize: "13px",
          border: "1px solid #ffe58f",
          borderRadius: "6px",
        }}
      >
        <b>DEBUG:</b> Loaded deals/offers:
        <br />
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            margin: 0,
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          {JSON.stringify(deals, null, 2)}
        </pre>
      </div> */}

      {/* Today's Deals */}
      <div className="deals-section">
        <div className="section-header">
          <h2>Today's Deals</h2>
          <p>Limited time offers</p>
        </div>

        <div className="cards-grid cards-grid-large">
          {deals.length === 0 ? (
            <div className="under-development">
              <h3>🚧 Deals coming soon! 🚧</h3>
              <p>We're working hard to bring you amazing deals</p>
            </div>
          ) : (
            deals.map((deal) => (
              <div className="card-base card-large deal-card" key={deal._id}>
                <div className="card-image-container">
                  <img
                    src={
                      deal.image ||
                      "https://images.pexels.com/photos/3119215/pexels-photo-3119215.jpeg"
                    }
                    alt={deal.title || deal.name}
                    className="card-image"
                  />
                  <div className="card-badge card-badge-discount">
                    {deal.discountPercentage
                      ? `-${deal.discountPercentage}%`
                      : "DEAL"}
                  </div>
                  {deal.isOffer && (
                    <div
                      className="card-badge card-badge-offer"
                      style={{
                        background: "#ff4757",
                        color: "#fff",
                        top: 40,
                        left: 10,
                        position: "absolute",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      TODAY'S OFFER
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h4 className="card-title">{deal.title || deal.name}</h4>
                  <p className="card-description">{deal.description}</p>
                  <div className="card-subtitle">
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#232f3e",
                      }}
                    >
                      ₹{deal.dealPrice || deal.price}
                    </span>
                    {deal.originalPrice && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          textDecoration: "line-through",
                          marginLeft: "8px",
                        }}
                      >
                        ₹{deal.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Business Partnership Section */}
      <div className="business-section">
        <div className="business-content">
          <div className="business-card">
            <div className="business-text">
              <h3>Sell on E-Mall World</h3>
              <p>Reach millions of customers and grow your business</p>
              <button className="business-btn" onClick={handleGetStarted}>
                Start Selling
              </button>
            </div>
            <div className="business-image">
              <img
                src="https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg"
                alt="Business"
              />
            </div>
          </div>

          <div className="business-card">
            <div className="business-text">
              <h3>Become a Delivery Partner</h3>
              <p>Earn money by delivering packages in your area</p>
              <button className="business-btn" onClick={handleGetStarted}>
                Join Now
              </button>
            </div>
            <div className="business-image">
              <img
                src="https://images.pexels.com/photos/13968342/pexels-photo-13968342.jpeg"
                alt="Delivery"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        <div className="additional-sections">
          <DealsList />
          <BottomCard />
        </div>
      </div>
    </div>
  );
}
