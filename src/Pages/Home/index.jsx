/* eslint-disable no-unused-vars */
// Logic/JavaScript Part
import "./Home.css";
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
  // State management
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [deals, setDeals] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered products
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Category filter
    if (activeCategory) {
      filtered = filtered.filter((p) => p.category?.name === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
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

  // Navigation handler
  const handleGetStarted = () => {
    window.location.href = "/menu";
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchCategories(), fetchProducts(), fetchDeals()]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // API calls
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
      console.log("Index fetch data : --", response.data.products);
    } catch (error) {
      toast.error("Error fetching products");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      const offersRes = await axios.get(
        "http://localhost:8080/api/offers/today"
      );
      const offers = offersRes.data.offers || [];

      const mappedOffers = offers.map((offer) => ({
        _id: offer._id,
        title: offer.title || offer.product?.name || "Today's Offer",
        description:
          offer.description ||
          offer.product?.description ||
          "Special offer for today only!",
        image: processImageUrl(offer.product?.image),
        dealPrice: calculateDealPrice(offer),
        originalPrice: offer.product?.price || offer.price,
        discountPercentage: offer.discount || 0,
        shopName: getShopName(offer),
        isOffer: true,
        rating: offer.product?.rating || 4.5,
        reviewCount: offer.product?.reviewCount || 100,
      }));

      const response = await axios.get("/api/deals/active");
      const allDeals = [...mappedOffers, ...(response.data.deals || [])];
      setDeals(allDeals);
    } catch (error) {
      console.error("Deals fetch error:", error);
      setDeals([]);
    }
  };

  // Helper functions
  const processImageUrl = (image) => {
    if (image && image.startsWith("/uploads")) {
      return `http://localhost:8080${image}`;
    }
    return image || "/images/offer1.png";
  };

  const calculateDealPrice = (offer) => {
    return (
      offer.price ||
      (offer.product?.price
        ? Math.round(offer.product.price * (1 - (offer.discount || 0) / 100))
        : undefined)
    );
  };

  const getShopName = (offer) => {
    return (
      offer.shop?.shopName || offer.shop?.names || offer.shop?.email || "Shop"
    );
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

  // Component definitions
 const ProductCard = ({ product }) => {
    const image =
      processImageUrl(product.image) ||
      "https://images.pexels.com/photos/6214360/pexels-photo-6214360.jpeg";

    return (
      <div className="card-base card-large product-card">
        <div className="card-image-container">
          <img
            src={image}
            alt={product.name}
            className="card-image"
            loading="lazy"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="card-content">
          <h3 className="card-title">{product.name}</h3>
          <ProductRating product={product} renderStars={renderStars} />
          <ProductPrice product={product} />
          <ProductBadges product={product} />
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
  };

  // JSX/Template Part
  return (
    <div className="amazon-home-container">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TrustBadges />
      <CategoriesSection
        categories={categories}
        setActiveCategory={setActiveCategory}
      />
      <FilterSortBar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <FeaturedProducts
        loading={loading}
        filteredProducts={filteredProducts}
        ProductCard={ProductCard}
      />
      <DealsSection deals={deals} />
      {/* <BusinessSection handleGetStarted={handleGetStarted} /> */}
      {/* <FooterContent /> */}
    </div>
  );
}

// Subcomponents
const HeroSection = ({ searchQuery, setSearchQuery }) => (
  <div className="hero-banner">
    <div className="hero-content">
      <div className="hero-text">
        <h1>Welcome to E-Mall World</h1>
        <p>Discover millions of products from thousands of brands</p>
        <div className="hero-search-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button className="search-btn">
              <Search />
            </button>
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
);

const TrustBadges = () => (
  <div className="trust-badges">
    {[
      { Icon: Truck, text: "Fast Delivery" },
      { Icon: Shield, text: "Secure Payment" },
      { Icon: RefreshCw, text: "Easy Returns" },
      { Icon: Award, text: "Quality Assured" },
    ].map(({ Icon, text }) => (
      <div key={text} className="trust-badge">
        <Icon size={24} />
        <span>{text}</span>
      </div>
    ))}
  </div>
);

const CategoriesSection = ({ categories, setActiveCategory }) => (
  <div className="categories-section">
    <h2>Shop by Category</h2>
    <div className="cards-grid cards-grid-medium">
      {categories.map((cat) => (
        <CategoryCard
          key={cat._id}
          category={cat}
          setActiveCategory={setActiveCategory}
        />
      ))}
    </div>
  </div>
);

const CategoryCard = ({ category, setActiveCategory }) => (
  <div
    className="card-base card-medium category-card"
    onClick={() => setActiveCategory(category.name)}
  >
    <div className="card-image-container">
      <img
        src={
          category.image
            ? `http://localhost:8080${category.image}`
            : "https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg"
        }
        alt={category.name}
        className="card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg";
        }}
      />
    </div>
    <div className="card-content">
      <h3 className="card-title">{category.name}</h3>
      <p className="card-subtitle">{category.shopCount || 0} stores</p>
    </div>
  </div>
);

const FilterSortBar = ({
  categories,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
}) => (
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
);

const FeaturedProducts = ({ loading, filteredProducts, ProductCard }) => (
  <div className="products-section">
    <div className="section-header">
      <h2
        style={{
          fontWeight: "bold",
          borderBottom: "2px solid #232f3e",
          paddingBottom: "10px",
          display: "block",
          width: "fit-content",
          textAlign: "center",
          margin: "0 auto 30px",
        }}
      >
        Featured Products
      </h2>
      <p>Handpicked items just for you</p>
    </div>

    {loading ? (
      <LoadingGrid />
    ) : filteredProducts.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="cards-grid cards-grid-large">
        {filteredProducts.slice(0, 12).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )}
  </div>
);

const LoadingGrid = () => (
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

const EmptyState = () => (
  <div className="under-development">
    <h3>🚧 Products Coming Soon! 🚧</h3>
    <p>We're working hard to bring you amazing products</p>
  </div>
);

const DealsSection = ({ deals }) => (
  <div className="deals-section">
    <div className="section-header">
      <h2
        style={{
          fontWeight: "bold",
          borderBottom: "2px solid #232f3e",
          paddingBottom: "10px",
          display: "block",
          width: "fit-content",
          textAlign: "center",
          margin: "0 auto 30px",
        }}
      >
        Today's Deals
      </h2>
      <p>Limited time offers</p>
    </div>

    <div className="cards-grid cards-grid-large">
      {deals.length === 0 ? (
        <EmptyState />
      ) : (
        deals.map((deal) => <DealCard key={deal._id} deal={deal} />)
      )}
    </div>
  </div>
);

const DealCard = ({ deal }) => (
  <div className="card-base card-large deal-card">
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
        {deal.discountPercentage ? `-${deal.discountPercentage}%` : "DEAL"}
      </div>
      {deal.isOffer && (
        <div className="card-badge card-badge-offer">TODAY'S OFFER</div>
      )}
    </div>
    <div className="card-content">
      <h4 className="card-title">{deal.title || deal.name}</h4>
      <p className="card-description">{deal.description}</p>
      <div className="card-subtitle">
        <span className="deal-price">₹{deal.dealPrice || deal.price}</span>
        {deal.originalPrice && (
          <span className="original-price">₹{deal.originalPrice}</span>
        )}
      </div>
    </div>
  </div>
);

// const BusinessSection = ({ handleGetStarted }) => (
//   <div className="business-section">
//     <div className="business-content">
//       <BusinessCard
//         title="Sell on E-Mall World"
//         description="Reach millions of customers and grow your business"
//         buttonText="Start Selling"
//         image="https://images.pexels.com/photos/11077404/pexels-photo-11077404.jpeg"
//         onClick={handleGetStarted}
//       />
//       <BusinessCard
//         title="Become a Delivery Partner"
//         description="Earn money by delivering packages in your area"
//         buttonText="Join Now"
//         image="https://images.pexels.com/photos/13968342/pexels-photo-13968342.jpeg"
//         onClick={handleGetStarted}
//       />
//     </div>
//   </div>
// );

// const BusinessCard = ({ title, description, buttonText, image, onClick }) => (
//   <div className="business-card">
//     <div className="business-text">
//       <h3>{title}</h3>
//       <p>{description}</p>
//       <button className="business-btn" onClick={onClick}>
//         {buttonText}
//       </button>
//     </div>
//     <div className="business-image">
//       <img src={image} alt={title} />
//     </div>
//   </div>
// );

const FooterContent = () => (
  <div className="footer-content">
    <div className="additional-sections">
      <DealsList />
      {/* <BottomCard /> */}
    </div>
  </div>
);

const ProductRating = ({ product, renderStars }) => (
  <div className="product-rating" style={{ margin: "6px 0" }}>
    <div className="stars">{renderStars(product.rating || 4.5)}</div>
    <span className="rating-count">
      ({product.reviewCount || Math.floor(Math.random() * 500) + 50})
    </span>
  </div>
);

const ProductPrice = ({ product }) => (
  <div className="card-description" style={{ margin: "6px 0" }}>
    <span className="current-price">₹{product.price}</span>
    {product.originalPrice && (
      <span className="original-price">₹{product.originalPrice}</span>
    )}
  </div>
);

const ProductBadges = ({ product }) => (
  <>
    {product.discount && (
      <div className="discount-badge">-{product.discount}% OFF</div>
    )}
    <div className="delivery-badges">
      <span className="prime-badge">Prime</span>
      <span className="free-delivery">FREE Delivery</span>
    </div>
  </>
);
