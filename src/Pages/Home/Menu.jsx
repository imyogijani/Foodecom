/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./restaurant.css";
import "./HomeLayout.css";
import "./theme-override.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  ShoppingCart,
  Heart,
  Filter,
  Grid,
  List,
  Search,
  ChevronDown,
  Truck,
  Shield,
} from "lucide-react";

// Modern E-mall sample data with better images and pricing
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

const mallCategories = [
  "Top Deals",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books & Media",
  "Toys & Games",
  "Sports & Fitness",
  "Beauty & Health",
];

const mallItemsByCategory = {
  "Top Deals": [
    {
      id: "deal-1",
      title: "50% Off Electronics",
      desc: "Limited time flash sale on gadgets",
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
      price: "₹999",
      originalPrice: "₹1999",
      discount: 50,
      rating: 4.5,
      reviews: 328,
      prime: true,
    },
    {
      id: "deal-2",
      title: "Buy 2 Get 1 Free Books",
      desc: "Amazing collection of bestsellers",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      price: "₹399",
      originalPrice: "₹599",
      discount: 33,
      rating: 4.3,
      reviews: 156,
      prime: true,
    },
    {
      id: "deal-3",
      title: "Fashion Week Sale",
      desc: "Trendy clothes at unbeatable prices",
      image:
        "https://images.pexels.com/photos/3119215/pexels-photo-3119215.jpeg",
      price: "₹1299",
      originalPrice: "₹2499",
      discount: 48,
      rating: 4.7,
      reviews: 892,
      prime: true,
    },
  ],
  Electronics: [
    {
      id: "el-1",
      title: "iPhone 15 Pro Max",
      desc: "Latest flagship with A17 Pro chip",
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
      price: "₹159999",
      originalPrice: "₹169999",
      rating: 4.8,
      reviews: 2341,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "el-2",
      title: "Sony WH-1000XM5",
      desc: "Premium noise-cancelling headphones",
      image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
      price: "₹29999",
      originalPrice: "₹34999",
      rating: 4.6,
      reviews: 1567,
      prime: true,
    },
    {
      id: "el-3",
      title: "MacBook Pro M3",
      desc: "Professional laptop for creators",
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
      price: "₹199999",
      rating: 4.9,
      reviews: 876,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "el-4",
      title: "Apple Watch Series 9",
      desc: "Advanced health and fitness tracking",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      price: "₹41999",
      originalPrice: "₹45999",
      rating: 4.7,
      reviews: 1234,
      prime: true,
    },
    {
      id: "el-5",
      title: "PlayStation 5 Console",
      desc: "Next-gen gaming experience",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
      price: "₹54999",
      rating: 4.8,
      reviews: 3421,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "el-6",
      title: 'Samsung 65" QLED 4K TV',
      desc: "Stunning picture quality with smart features",
      image:
        "https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg",
      price: "₹89999",
      originalPrice: "₹109999",
      rating: 4.5,
      reviews: 987,
      prime: true,
      freeDelivery: true,
    },
  ],
  Fashion: [
    {
      id: "fa-1",
      title: "Premium Cotton T-Shirt",
      desc: "Comfortable everyday wear",
      image:
        "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      price: "₹799",
      originalPrice: "₹1299",
      rating: 4.3,
      reviews: 567,
      prime: true,
    },
    {
      id: "fa-2",
      title: "Designer Evening Dress",
      desc: "Elegant party wear collection",
      image:
        "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      price: "₹4999",
      originalPrice: "₹7999",
      rating: 4.6,
      reviews: 234,
      prime: true,
    },
    {
      id: "fa-3",
      title: "Nike Air Max Sneakers",
      desc: "Premium athletic footwear",
      image:
        "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg",
      price: "₹8999",
      originalPrice: "₹12999",
      rating: 4.7,
      reviews: 1456,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "fa-4",
      title: "Levi's Denim Jacket",
      desc: "Classic denim for all seasons",
      image:
        "https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg",
      price: "₹3999",
      originalPrice: "₹5999",
      rating: 4.4,
      reviews: 678,
      prime: true,
    },
    {
      id: "fa-5",
      title: "Winter Puffer Jacket",
      desc: "Warm and stylish winter protection",
      image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg",
      price: "₹6999",
      originalPrice: "₹9999",
      rating: 4.5,
      reviews: 345,
      prime: true,
    },
    {
      id: "fa-6",
      title: "Business Formal Suit",
      desc: "Professional attire for success",
      image:
        "https://images.pexels.com/photos/3251530/pexels-photo-3251530.jpeg",
      price: "₹14999",
      originalPrice: "₹19999",
      rating: 4.8,
      reviews: 123,
      prime: true,
    },
  ],
  "Home & Kitchen": [
    {
      id: "hk-1",
      title: "Vitamix Professional Blender",
      desc: "High-performance kitchen blender",
      image:
        "https://images.pexels.com/photos/3768169/pexels-photo-3768169.jpeg",
      price: "₹24999",
      originalPrice: "₹29999",
      rating: 4.7,
      reviews: 456,
      prime: true,
    },
    {
      id: "hk-2",
      title: "Nespresso Coffee Machine",
      desc: "Premium coffee brewing system",
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
      price: "₹18999",
      originalPrice: "₹22999",
      rating: 4.6,
      reviews: 789,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "hk-3",
      title: "Dyson V15 Cordless Vacuum",
      desc: "Powerful cordless cleaning",
      image:
        "https://images.pexels.com/photos/4109489/pexels-photo-4109489.jpeg",
      price: "₹45999",
      originalPrice: "₹52999",
      rating: 4.8,
      reviews: 234,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "hk-4",
      title: "Samsung Smart Refrigerator",
      desc: "Large capacity with smart features",
      image:
        "https://images.pexels.com/photos/3251531/pexels-photo-3251531.jpeg",
      price: "₹89999",
      originalPrice: "₹99999",
      rating: 4.5,
      reviews: 167,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "hk-5",
      title: "LG Front Load Washer",
      desc: "Efficient washing with steam technology",
      image:
        "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg",
      price: "₹54999",
      originalPrice: "₹64999",
      rating: 4.4,
      reviews: 345,
      prime: true,
      freeDelivery: true,
    },
  ],
  "Books & Media": [
    {
      id: "bm-1",
      title: "Bestseller Fiction Collection",
      desc: "Top-rated mystery and thriller novels",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      price: "₹599",
      originalPrice: "₹899",
      rating: 4.5,
      reviews: 1234,
      prime: true,
    },
    {
      id: "bm-2",
      title: "Self-Development Bundle",
      desc: "Personal growth and success guides",
      image:
        "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
      price: "₹899",
      originalPrice: "₹1299",
      rating: 4.3,
      reviews: 567,
      prime: true,
    },
    {
      id: "bm-3",
      title: "Professional Cookbook Set",
      desc: "Master chef recipes and techniques",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      price: "₹1499",
      originalPrice: "₹1999",
      rating: 4.7,
      reviews: 234,
      prime: true,
    },
    {
      id: "bm-4",
      title: "Sci-Fi Epic Series",
      desc: "Complete space adventure collection",
      image:
        "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
      price: "₹1299",
      originalPrice: "₹1799",
      rating: 4.6,
      reviews: 789,
      prime: true,
    },
  ],
  "Toys & Games": [
    {
      id: "tg-1",
      title: "LEGO Architecture Set",
      desc: "Creative building for all ages",
      image:
        "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg",
      price: "₹3999",
      originalPrice: "₹4999",
      rating: 4.8,
      reviews: 456,
      prime: true,
    },
    {
      id: "tg-2",
      title: "Remote Control Drone",
      desc: "High-tech flying experience",
      image:
        "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg",
      price: "₹8999",
      originalPrice: "₹12999",
      rating: 4.5,
      reviews: 234,
      prime: true,
      freeDelivery: true,
    },
    {
      id: "tg-3",
      title: "Premium Board Game Collection",
      desc: "Family entertainment bundle",
      image: "https://images.pexels.com/photos/187161/pexels-photo-187161.jpeg",
      price: "₹2999",
      originalPrice: "₹3999",
      rating: 4.6,
      reviews: 678,
      prime: true,
    },
    {
      id: "tg-4",
      title: "Luxury Dollhouse Set",
      desc: "Detailed miniature home with furniture",
      image:
        "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg",
      price: "₹12999",
      originalPrice: "₹16999",
      rating: 4.7,
      reviews: 123,
      prime: true,
      freeDelivery: true,
    },
  ],
};

const getItemsByCategory = (category) => mallItemsByCategory[category] || [];
const getAllMallItems = () => Object.values(mallItemsByCategory).flat();

export default function Menu() {
  const [activeTab, setActiveTab] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filterAndSortItems = (items) => {
    if (!items) return [];

    let filtered = items;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Price range filter
    filtered = filtered.filter((item) => {
      const price = parseInt(item.price.replace(/[₹,]/g, ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseInt(a.price.replace(/[₹,]/g, "")) -
            parseInt(b.price.replace(/[₹,]/g, "")),
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseInt(b.price.replace(/[₹,]/g, "")) -
            parseInt(a.price.replace(/[₹,]/g, "")),
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 4.0) - (a.rating || 4.0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        // relevance - keep original order
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

  const toggleWishlist = (e, itemId) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(itemId)) {
      newWishlist.delete(itemId);
      toast.info("Removed from wishlist");
    } else {
      newWishlist.add(itemId);
      toast.success("Added to wishlist ❤️");
    }
    setWishlist(newWishlist);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="star-filled" size={14} fill="currentColor" />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="star-half" size={14} fill="currentColor" />,
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
        <button
          className={`wishlist-button ${wishlist.has(item.id) ? "active" : ""}`}
          onClick={(e) => toggleWishlist(e, item.id)}
        >
          <Heart
            size={18}
            fill={wishlist.has(item.id) ? "currentColor" : "none"}
          />
        </button>
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
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      );
    }

    const items = getItemsByCategory(activeTab);
    const filteredItems = filterAndSortItems(items);

    if (filteredItems.length === 0) {
      return (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
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
      {/* Header Section */}
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

      {/* Search and Filter Bar */}
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

      {/* Advanced Filters Panel */}
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

      {/* Category Tabs */}
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

      {/* Products Section */}
      <div className="products-section">
        <div className="results-info">
          <h2>{activeTab}</h2>
          <p>
            {filterAndSortItems(getItemsByCategory(activeTab)).length} results
          </p>
        </div>

        {renderContent()}
      </div>

      {/* Info Cards */}
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
