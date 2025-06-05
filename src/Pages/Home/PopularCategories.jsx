// Demo page
// src/Components/Home/PopularCategories.jsx
import React from 'react';
import cat1 from '../../images/cat1.png';
import cat2 from '../../images/cat2.png';
import cat3 from '../../images/cat3.png';
import cat4 from '../../images/cat4.png';
import cat5 from '../../images/cat5.png';
import cat6 from '../../images/cat6.png';

const categories = [
  { name: "Burgers & Fast food", restaurants: 21, img: cat1 },
  { name: "Salads", restaurants: 32, img: cat2 },
  { name: "Pasta & Casuals", restaurants: 4, img: cat3 },
  { name: "Pizza", restaurants: 8, img: cat4 },
  { name: "Breakfast", restaurants: 4, img: cat5 },
  { name: "Soups", restaurants: 32, img: cat6 },
];

export default function PopularCategories() {
  return (
    <div className="popular-categories">
      <h3>Order.uk Popular Categories 🥳</h3>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.img} alt={cat.name} />
            <h5>{cat.name}</h5>
            <p>{cat.restaurants} Restaurants</p>
          </div>
        ))}
      </div>
    </div>
  );
}
