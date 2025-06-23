/* eslint-disable no-unused-vars */
import "./Home.css";
import p1 from "../../images/Person-1.png";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import promo from "../../images/promo.png";
import BottomCard from "./BottomCard";
import StatsBanner from "./StatsBanner";
import { useCart } from "../../context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [deals, setDeals] = useState([]);

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
      const response = await axios.get("/api/category/get-category");
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
      toast.error("Error fetching restaurants");
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await axios.get("/api/deals");
      setDeals(response.data.deals);
    } catch (error) {
      console.error("Deals fetch error:", error);
      toast.error("Error fetching deals");
    }
  };

  return (
    <>
      <div className="Home">
        <div className="Home_text">
          <div className="text">
            <h2>Order Restaurant food takeaway and groceries.</h2>
            <h2>Feast Your Senses,</h2>
            <h2>Fast and Fresh</h2>
          </div>
          <div className="person">
            <img src={p1} alt="person" />
          </div>
        </div>
      </div>

      {/* === Top Deals Section === */}
      <div className="top-deals-container">
        <div className="top-deals-header">
          <h3>
            Up to <span>–40%</span> 🎉 Order.uk exclusive deals
          </h3>
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.name)}
                className={cat.name === activeCategory ? "active" : ""}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal scroll wrapper */}
        <div className="deal-cards-wrapper">
          <div className="deal-cards">
            {loading ? (
              <p>Loading products...</p>
            ) : (
              products.map((product) => (
                <div className="deal-card" key={product._id}>
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "placeholder.jpg"
                    }
                    alt={product.name}
                  />
                  <div className="badge">
                    {product.discountPercentage
                      ? `-${product.discountPercentage}%`
                      : ""}
                  </div>
                  <div className="overlay">
                    <span>
                      {product.shopId ? product.shopId.shopName : "N/A"}
                    </span>
                    <h4>{product.name}</h4>
                  </div>
                  <button
                    className="plus-icon"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image:
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "placeholder.jpg",
                      })
                    }
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* === Popular Categories Section === */}
      <div className="popular-categories">
        <h3>Order.uk Popular Categories 🥳</h3>
        <div className="category-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat._id}>
              <img src={`http://localhost:8080${cat.image}`} alt={cat.name} />
              <div className="category_text">
                <h5>{cat.name}</h5>
                <p>{cat.restaurantCount || 0} Shops</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Popular Restaurants Section === */}
      <div className="popular_restaurants">
        <h3>Popular Shops</h3>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div className="restaurant-card" key={restaurant._id}>
              <img src={restaurant.image} alt={restaurant.name} />
              <p>{restaurant.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Image Section */}
      <div
        className="promo-image-section"
        style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
      >
        <img
          src={promo}
          alt="Promo"
          style={{
            maxWidth: "70%",
            height: "auto",
            borderRadius: "16px",
          }}
        />
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
      <StatsBanner />
    </>
  );
}
