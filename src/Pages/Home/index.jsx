/* eslint-disable no-unused-vars */
import "./Home.css";
import shoppingImage from "../../images/shopping-hero.svg";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import BottomCard from "./BottomCard";
import StatsBanner from "./StatsBanner";
import { useCart } from "../../context/CartContext";
import DealsList from "./DealsList";

export default function Home() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [deals, setDeals] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Filter and sort products
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

  const handleGetStarted = () => {
    alert("Get Started clicked!");
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchRestaurants(),
          fetchDeals(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchCategories = async () => {
    try {
      // Use the new endpoint to get shop counts
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

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("/api/restaurants");
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error("Restaurant fetch error:", error);
      // toast.error("Error fetching restaurants"); // Under development, don't show error
      setRestaurants([]);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await axios.get("/api/deals");
      setDeals(response.data.deals);
    } catch (error) {
      console.error("Deals fetch error:", error);
      // toast.error("Error fetching deals"); // Under development, don't show error
      setDeals([]);
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to E-mall World</h1>
            <p>Your One-Stop Destination for All Shopping Needs</p>
          </div>
          <div className="hero-image">
            <img src={shoppingImage} alt="Shopping Experience" />
          </div>
        </div>
      </div>
      <StatsBanner />

      {/* --- REMOVE PRODUCT SECTION FROM HOME --- */}
      {/* === Featured Products Section === */}
      {/* (Moved to Shops page) */}

      {/* === Popular Categories Section === */}
      <div className="popular-categories">
        <h3>E-mall World Popular Categories 🥳</h3>
        <div className="category-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat._id}>
              <div className="category-image-wrapper">
                <img
                  src={
                    cat.image
                      ? `http://localhost:8080${cat.image}`
                      : "/vite.svg"
                  }
                  alt={cat.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/vite.svg";
                  }}
                  className="category-image"
                />
              </div>
              <div className="category-info">
                <h4>{cat.name}</h4>
                <p>{cat.shopCount || 0} Shops</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Exclusive Deals Section === */}
      <div className="exclusive-deals-container" style={{margin: "1rem 3rem" }}>
        <div className="exclusive-deals-header">
          <h3>
            Up to <span>–40%</span> 🎉 E-mall World Exclusive Deals
          </h3>
        </div>
        <div className="deal-cards-wrapper">
          <div className="deal-cards">
            {loading ? (
              <p>Loading deals...</p>
            ) : deals.length === 0 ? (
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
                }}
              >
                🚧 This section is under development 🚧
              </div>
            ) : (
              deals.map((deal) => (
                <div className="deal-card" key={deal._id}>
                  <img
                    src={
                      deal.image
                        ? deal.image.startsWith("/uploads")
                          ? `http://localhost:8080${deal.image}`
                          : deal.image
                        : "placeholder.jpg"
                    }
                    alt={deal.title || deal.name}
                  />
                  <div className="badge">
                    {deal.discountPercentage
                      ? `-${deal.discountPercentage}%`
                      : ""}
                  </div>
                  <div className="overlay">
                    <span>{deal.shopId ? deal.shopId.shopName : "N/A"}</span>
                    <h4>{deal.title || deal.name}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* === Popular Restaurants Section === */}
      <div className="popular_restaurants">
        <h3>Popular Shops</h3>
        <div className="restaurant-grid">
          {restaurants.length === 0 ? (
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
              }}
            >
              🚧 This section is under development 🚧
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div className="restaurant-card" key={restaurant._id}>
                <img src={restaurant.image} alt={restaurant.name} />
                <p>{restaurant.name}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Partner Banner Section */}
      <div className="partner-banner-row">
        <div className="partner-banner-box">
          <p className="top-label">Earn more with lower fees</p>
          <h4 className="subtitle">Signup as a business</h4>
          <h3 className="title">Partner with us</h3>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
        <div className="availperks-box">
          <p className="availperks-label">Unlock exclusive rewards</p>
          <h4 className="availperks-subtitle">Avail Perks</h4>
          <h3 className="availperks-title">Get special offers & discounts</h3>
          <button className="cta-button" onClick={handleGetStarted}>
            Avail Now
          </button>
        </div>
      </div>

      <BottomCard />
      <DealsList />
    </>
  );
}
