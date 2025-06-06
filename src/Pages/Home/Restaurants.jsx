import React, { useState } from "react";
import "./restaurant.css";
import offer1 from "../../images/offer1.png";
import offer2 from "../../images/offer2.png";
import offer3 from "../../images/offer3.png";
import burger1 from "../../images/burger1.png";
// import burger2 from "../../images/burger2.png";

const categories = [
  "Offers",
  "Burgers",
  "Fries",
  "Snacks",
  "Salads",
  "Cold drinks",
  "Happy Meal®",
  "Desserts",
  "Hot drinks",
  "Sauces",
  "Orbit®",
];

const offerItems = [
  {
    id: 1,
    title: "First Order Discount",
    image: offer1,
    discount: "-20%",
  },
  {
    id: 2,
    title: "Vegan Discount",
    image: offer2,
    discount: "-20%",
  },
  {
    id: 3,
    title: "Free ice Cream Offer",
    image: offer3,
    discount: "-100%",
  },
];

const burgerItems = [
  {
    id: 1,
    title: "Royal Cheese Burger with extra Fries",
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
    price: "GBP 23.10",
    image: burger1,
  },
  {
    id: 2,
    title: "The classics for 3",
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 cold drinks",
    price: "GBP 23.10",
    image: burger1,
  },
  {
    id: 3,
    title: "The classics for 3",
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 cold drinks",
    price: "GBP 23.10",
    image: burger1,
  },
];

export default function Restaurants() {
  const [activeTab, setActiveTab] = useState("Offers");

  const renderContent = () => {
    switch (activeTab) {
      case "Offers":
        return (
          <div className="offers-grid">
            {offerItems.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <img src={offer.image} alt={offer.title} />
                <div className="discount-badge">{offer.discount}</div>
                <div className="offer-info">
                  <span>McDonald's East London</span>
                  <h4>{offer.title}</h4>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "Burgers":
        return (
          <div className="burgers-grid">
            {burgerItems.map((burger) => (
              <div className="burger-card" key={burger.id}>
                <div className="burger-img-wrap">
                  <img src={burger.image} alt={burger.title} />
                  <span className="plus-icon">+</span>
                </div>
                <div className="burger-info">
                  <h4>{burger.title}</h4>
                  <p>{burger.desc}</p>
                  <span className="price">{burger.price}</span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div className="no-content">No items in {activeTab}.</div>;
    }
  };

  return (
    <div className="restaurant-offers">
      <div className="offers-header">
        <h2>All Offers from McDonald’s East London</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search from menu..." />
        </div>
      </div>

      <div className="offer-tabs">
        {categories.map((cat) => (
          <a
            key={cat}
            className={activeTab === cat ? "active" : ""}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </a>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
