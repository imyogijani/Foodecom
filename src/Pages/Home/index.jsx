import React, { useState } from "react";
import p1 from "../../images/Person-1.png";
import img1 from "../../images/TopD1.png";
import img2 from "../../images/TopD2.png";
import img3 from "../../images/TopD3.png";
import img4 from "../../images/TopD3.png";
import cat1 from "../../images/cat1.png";
import cat2 from "../../images/cat2.png";
import cat3 from "../../images/cat3.png";
import cat4 from "../../images/cat4.png";
import cat5 from "../../images/cat5.png";
import cat6 from "../../images/cat6.png";
import McD from "../../images/McD.png";
import papajohn from "../../images/Papajohns.png";
import kfc from "../../images/KFC.png";
import texasChicken from "../../images/Tex.png";
import burgerKing from "../../images/Bking.png";
import shaurma from "../../images/shaurma.png";

const deals = [
  {
    id: 1,
    img: img1,
    discount: "-40%",
    name: "Chef Burgers London",
  },
  {
    id: 2,
    img: img2,
    discount: "-20%",
    name: "Grand Ai Cafe London",
  },
  {
    id: 3,
    img: img3,
    discount: "-17%",
    name: "Butterbrot Cafe London",
  },
  {
    id: 4,
    img: img4,
    discount: "-17%",
    name: "Butterbrot Cafe London",
  },
  {
    id: 5,
    img: img4,
    discount: "-17%",
    name: "Butterbrot Cafe London",
  },
];

const categories = ["Vegan", "Sushi", "Pizza & Fast food", "Others"];

const categorie = [
  { name: "Burgers & Fast food", restaurants: 21, img: cat1 },
  { name: "Salads", restaurants: 32, img: cat2 },
  { name: "Pasta & Casuals", restaurants: 4, img: cat3 },
  { name: "Pizza", restaurants: 8, img: cat4 },
  { name: "Breakfast", restaurants: 4, img: cat5 },
  { name: "Soups", restaurants: 32, img: cat6 },
  { name: "Hello", restaurants: 2, img: cat6 },
];
const restaurants = [
  { name: "McDonald's London", img: McD },
  { name: "Papa Johns", img: papajohn },
  { name: "KFC West London", img: kfc },
  { name: "Texas Chicken", img: texasChicken },
  { name: "Burger King", img: burgerKing },
  { name: "Shaurma 1", img: shaurma },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Pizza & Fast food");

  return (
    <>
      <div className="Home">
        <div className="Home_text">
          <div className="text">
            <h2 style={{ color: "#03081F", fontSize: "18px" }}>
              Order Restaurant food takeaway and groceries.
            </h2>
            <h2 style={{ color: "#03081F", fontSize: "58px" }}>
              Feast Your Senses,
            </h2>
            <h2 style={{ color: "#FC8A06", fontSize: "58px" }}>
              Fast and Freash
            </h2>
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
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cat === activeCategory ? "active" : ""}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal scroll wrapper */}
        <div className="deal-cards-wrapper">
          <div className="deal-cards">
            {deals.map((deal) => (
              <div className="deal-card" key={deal.id}>
                <img src={deal.img} alt={deal.name} />
                <div className="badge">{deal.discount}</div>
                <div className="overlay">
                  <span>Restaurant</span>
                  <h4>{deal.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Popular Categories Section === */}
      <div className="popular-categories">
        <h3>Order.uk Popular Categories 🥳</h3>
        <div className="category-grid">
          {categorie.map((cat, index) => (
            <div className="category-card" key={index}>
              <img src={cat.img} alt={cat.name} />
              <div className="category_text">
                <h5>{cat.name}</h5>
                <p>{cat.restaurants} Restaurants</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Popular Restaurants Section === */}
      <div className="popular_restaurants">
        <h3>Popular Restaurants</h3>
        <div className="restaurant-grid">
          {restaurants.map((res, index) => (
            <div className="restaurant-card" key={index}>
              <img src={res.img} alt={res.name} />
              <p>{res.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
