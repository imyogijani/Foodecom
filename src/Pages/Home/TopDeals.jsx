// Demo page
// src/Components/Home/TopDeals.jsx
import React, { useState } from 'react';
import img1 from '../../images/TopD1.png'
import img2 from '../../images/TopD2.png'
import img3 from '../../images/TopD3.png'

// import img1 from '../../images/image1.png'; // Replace with correct paths
// import img2 from '../../images/image2.png';
// import img3 from '../../images/image3.png';

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
];

const categories = ["Vegan", "Sushi", "Pizza & Fast food", "Others"];

export default function TopDeals() {
  const [activeCategory, setActiveCategory] = useState("Pizza & Fast food");

  return (
    <div className="top-deals-container">
      <h3>Up to <span>–40%</span> 🎉 Order.uk exclusive deals</h3>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cat === activeCategory ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="deal-cards">
        {deals.map((deal, i) => (
          <div className="deal-card" key={deal.id}>
            <img src={deal.img} alt={deal.name} />
            <div className="overlay">
              <div className="badge">{deal.discount}</div>
              <div className="text">
                <span>Restaurant</span>
                <h4>{deal.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
