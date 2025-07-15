/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./Menu.css";
import "./offers-modern.css";
import "./theme-override.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  ShoppingCart,
  Filter,
  Clock,
  TrendingDown,
  Zap,
  Tag,
} from "lucide-react";
import axios from "../../utils/axios";
import { addToCartAPI } from "../../api/cartApi/cartApi";
const mallInfo = {
  name: "E-Mall World",
  description: "Your trusted shopping destination",
  rating: 4.6,
  reviews: 125000,
};

// Enhanced deals data with proper pricing and discounts
const dealItems = [
  {
    id: "deal-1",
    title: "iPhone 15 Pro Max - Limited Time",
    desc: "Latest flagship with A17 Pro chip, titanium design",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
    currentPrice: "₹134999",
    originalPrice: "₹159999",
    discount: 16,
    store: "ElectroWorld",
    badge: "FLASH SALE",
    rating: 4.8,
    reviews: 2341,
    timeLeft: "2 days left",
    savings: "₹25000",
  },
  {
    id: "deal-2",
    title: "Premium Fashion Collection",
    desc: "Designer clothing at unbeatable prices",
    image: "https://images.pexels.com/photos/3119215/pexels-photo-3119215.jpeg",
    currentPrice: "₹1299",
    originalPrice: "₹2999",
    discount: 57,
    store: "FashionHub",
    badge: "MEGA DEAL",
    rating: 4.5,
    reviews: 892,
    timeLeft: "5 hours left",
    savings: "₹1700",
  },
  {
    id: "deal-3",
    title: "Home Appliance Bundle",
    desc: "Kitchen essentials combo pack",
    image:
      "https://images.pexels.com/photos/13968342/pexels-photo-13968342.jpeg",
    currentPrice: "₹8999",
    originalPrice: "₹15999",
    discount: 44,
    store: "HomeEssentials",
    badge: "COMBO OFFER",
    rating: 4.3,
    reviews: 567,
    timeLeft: "1 day left",
    savings: "₹7000",
  },
  {
    id: "deal-4",
    title: "Laptop Gaming Special",
    desc: "High-performance gaming laptop with RTX graphics",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    currentPrice: "₹89999",
    originalPrice: "₹119999",
    discount: 25,
    store: "TechZone",
    badge: "GAMING DEAL",
    rating: 4.7,
    reviews: 1234,
    timeLeft: "3 days left",
    savings: "₹30000",
  },
  {
    id: "deal-5",
    title: "Wireless Audio Combo",
    desc: "Premium headphones + earbuds bundle",
    image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
    currentPrice: "₹12999",
    originalPrice: "₹24999",
    discount: 48,
    store: "AudioMart",
    badge: "BUNDLE DEAL",
    rating: 4.6,
    reviews: 789,
    timeLeft: "6 hours left",
    savings: "₹12000",
  },
  {
    id: "deal-6",
    title: "Smart Watch Collection",
    desc: "Latest smartwatches with health tracking",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    currentPrice: "₹15999",
    originalPrice: "₹24999",
    discount: 36,
    store: "SmartGadgets",
    badge: "LIMITED STOCK",
    rating: 4.4,
    reviews: 456,
    timeLeft: "12 hours left",
    savings: "₹9000",
  },
];

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dealsProduct, setDealsProduct] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers/today");
        const data = await res.json();
        if (data && data.offers) {
          // Map backend offers to dealItems format
          const mapped = data.offers.map((offer) => ({
            id: offer._id,
            title: offer.title,
            desc: offer.description,
            image: offer.product?.image,
            currentPrice:
              offer.price || offer.product?.price * (1 - offer.discount / 100),
            originalPrice: offer.product?.price,
            discount: offer.discount,
            store:
              offer.shop?.shopName || offer.shop?.names || offer.shop?.email,
            badge: "TODAY'S OFFER",
            rating: offer.product?.rating || 4.5,
            reviews: offer.product?.reviewCount || 100,
            timeLeft: "Today only",
            savings:
              offer.product?.price && offer.discount
                ? `₹${Math.round((offer.product.price * offer.discount) / 100)}`
                : undefined,
          }));
          setOffers(mapped);
        }
      } catch (e) {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchDealsProduct = async () => {
      try {
        const response = await axios.get("/api/deals/active");
        console.log("Fetched deals:", response.data.deals);
        setDealsProduct(response.data.deals || []);
      } catch (error) {
        console.error("Error fetching active deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealsProduct();
  }, []);

  const filterDeals = (deals) => {
    // let filtered = deals;
    let filtered = [...deals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (deal) =>
          deal.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          deal.seller.shopName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterBy !== "all") {
      switch (filterBy) {
        case "flash":
          filtered = filtered.filter((deal) => deal.badge?.includes("FLASH"));
          break;
        case "high-discount":
          filtered = filtered.filter((deal) => deal.discountPercentage >= 40);
          break;
        case "ending-soon":
          filtered = filtered.filter((deal) => {
            const end = new Date(deal.endDate).getTime();
            const now = new Date().getTime();
            const diff = end - now;
            const hoursLeft = diff / (1000 * 60 * 60);
            return hoursLeft <= 6; // e.g., less than 6 hours
          });
          break;
      }
    }

    // Sort
    if (sortBy === "discount-high") {
      filtered = [...filtered].sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      );
    } else if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.dealPrice - b.dealPrice);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort(
        (a, b) =>
          (b.product.averageRating || 0) - (a.product.averageRating || 0)
      );
    }
    return filtered;
  };

  // const handleAddToCart = (e, deal) => {
  //   e.stopPropagation();
  //   addToCart({
  //     ...deal,
  //     quantity: 1,
  //     addedAt: new Date().toISOString(),
  //     price: deal.currentPrice,
  //   });
  //   toast.success(`${deal.title} added to cart! 🛒`);
  // };
  const handleAddToCart = async (e, deal) => {
    e.stopPropagation();

    // const user = JSON.parse(localStorage.getItem("user"));
    // console.log("User 1211431243", user);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const productData = {
        productId: deal.product._id,
        quantity: 1,
        price: deal.dealPrice,
        title: deal.product.name,
        image: deal.product.image,
        discount: deal.discountPercentage,
      };

      const response = await addToCartAPI(userId, productData);

      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart.");
    }
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

  const processImageUrl = (image) => {
    if (image && image.startsWith("/uploads")) {
      return `http://localhost:8080${image}`;
    }
    return image || "/images/offer1.png";
  };
  const DealCard = ({ deal }) => (
    <div
      className="deal-card-modern"
      onClick={() =>
        navigate(`/product/${deal.product._id}`, { state: { item: deal } })
      }
    >
      <div className="deal-image-container">
        {/* <img src={deal.image} alt={deal.title} loading="lazy" /> */}
        <img
          src={processImageUrl(deal.product.image)}
          alt={deal.title}
          loading="lazy"
        />

        <div className="deal-badge-container">
          <div className="deal-discount-badge">-{deal.discountPercentage}%</div>
          <div className="deal-special-badge">{deal.badge}</div>
        </div>

        <div className="deal-timer">
          <Clock size={12} />
          {/* <span>{deal.timeLeft}</span> */}
          <span>{deal.endDate}</span>
        </div>
      </div>

      <div className="deal-content">
        <div className="deal-header">
          {/* <h3 className="deal-title">{deal.title}</h3>
          <p className="deal-description">{deal.description}</p> */}
          <h3 className="deal-title">{deal.product.name}</h3>
          <p className="deal-description">{deal.product.description}</p>
        </div>

        <div className="deal-rating-section">
          <div className="deal-stars">
            {renderStars(deal.product.averageRating || 1)}
          </div>
          <span className="deal-rating-text">
            {deal.product.averageRating || 1}
          </span>
          <span className="deal-reviews">
            {/* ({deal.reviews.toLocaleString()}) */}(
            {deal.product.totalReviews})
          </span>
        </div>

        <div className="deal-pricing">
          <div className="deal-price-row">
            <span className="deal-current-price">{deal.dealPrice}</span>
            <span className="deal-original-price">{deal.originalPrice}</span>
          </div>
          <div className="deal-savings">
            <span className="savings-text">Save {deal.moneySaved}</span>
            <span className="savings-percent">
              ({deal.discountPercentage}% off)
            </span>
          </div>
        </div>

        <div className="deal-store-info">
          <Tag size={14} />
          <span>By {deal.seller.shopName}</span>
        </div>

        <button
          className="deal-add-to-cart"
          onClick={(e) => handleAddToCart(e, deal)}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );

  // const allDeals = [...dealsProduct, ...offers, ...dealItems];
  const allDeals = [...dealsProduct];
  const filteredDeals = filterDeals(allDeals);

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <div className="offers-hero">
        <div className="offers-hero-content">
          <div className="offers-hero-text">
            <h1>Today's Best Deals</h1>
            <p>Limited time offers you don't want to miss</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <TrendingDown size={24} />
                <span>Up to 70% OFF</span>
              </div>
              <div className="hero-stat">
                <Zap size={24} />
                <span>Flash Sales</span>
              </div>
              <div className="hero-stat">
                <Clock size={24} />
                <span>Limited Time</span>
              </div>
            </div>
          </div>
          <div className="offers-hero-image">
            <img
              src="https://images.pexels.com/photos/6214360/pexels-photo-6214360.jpeg"
              alt="Great Deals"
            />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="offers-controls">
        <div className="offers-search">
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="offers-search-input"
          />
        </div>

        <div className="offers-filters">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="offers-filter-select"
          >
            <option value="all">All Deals</option>
            <option value="flash">Flash Sales</option>
            <option value="high-discount">High Discount (40%+)</option>
            <option value="ending-soon">Ending Soon</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="offers-sort-select"
          >
            <option value="">Sort by</option>
            <option value="discount-high">Highest Discount</option>
            <option value="price-low">Lowest Price</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="offers-main-content">
        <div className="offers-header">
          <h2>🔥 Hot Deals ({filteredDeals.length} items)</h2>
          <p>Grab these amazing offers before they're gone!</p>
        </div>
        <div className="deals-grid-container">
          {loading ? (
            <div className="no-deals-found">
              <h3>Loading...</h3>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="no-deals-found">
              <h3>No deals found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredDeals.map((deal) => <DealCard key={deal._id} deal={deal} />)
          )}
        </div>
      </div>

      {/* Deal Categories */}
      <div className="deal-categories-section">
        <h2>Shop by Deal Category</h2>
        <div className="deal-categories-grid">
          <div className="deal-category-card">
            <Zap size={32} />
            <h3>Flash Sales</h3>
            <p>Lightning deals ending soon</p>
            <span className="category-count">5 active deals</span>
          </div>
          <div className="deal-category-card">
            <TrendingDown size={32} />
            <h3>Mega Discounts</h3>
            <p>Savings up to 70% off</p>
            <span className="category-count">8 active deals</span>
          </div>
          <div className="deal-category-card">
            <Tag size={32} />
            <h3>Bundle Offers</h3>
            <p>Buy more, save more</p>
            <span className="category-count">3 active deals</span>
          </div>
        </div>
      </div>

      {/* Deal Information */}
      <div className="deal-info-section">
        <div className="deal-info-cards">
          <div className="deal-info-card">
            <h3>🎯 Deal Highlights</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Total Active Deals:</span>
                <span className="info-value">{dealItems.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Maximum Discount:</span>
                <span className="info-value">Up to 70% OFF</span>
              </div>
              <div className="info-item">
                <span className="info-label">Flash Sales:</span>
                <span className="info-value">Limited Time Only</span>
              </div>
            </div>
          </div>

          <div className="deal-info-card">
            <h3>📋 Terms & Conditions</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Valid For:</span>
                <span className="info-value">All Customers</span>
              </div>
              <div className="info-item">
                <span className="info-label">Delivery:</span>
                <span className="info-value">FREE on eligible orders</span>
              </div>
              <div className="info-item">
                <span className="info-label">Returns:</span>
                <span className="info-value">30-day return policy</span>
              </div>
            </div>
          </div>

          <div className="deal-info-card">
            <h3>🚀 Why Choose Our Deals?</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Authenticity:</span>
                <span className="info-value">100% Genuine Products</span>
              </div>
              <div className="info-item">
                <span className="info-label">Customer Support:</span>
                <span className="info-value">24/7 Available</span>
              </div>
              <div className="info-item">
                <span className="info-label">Satisfaction:</span>
                <span className="info-value">98% Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
