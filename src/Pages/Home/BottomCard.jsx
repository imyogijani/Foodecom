import React, { useState } from "react";
import "./BottomCard.css";
import image1 from "../../images/image1.png";
import offer1 from "../../images/offer1.png";
import offer2 from "../../images/offer2.png";

const faqTabs = [
  { label: "Frequent Questions", faqs: [
    { q: "How does Order.UK work?", highlight: true },
    { q: "What payment methods are accepted?" },
    { q: "Can I track my order in real-time?" },
    { q: "Are there any special discounts or promotions available?" },
    { q: "Is Order.UK available in my area?" },
  ] },
  { label: "Who we are?", faqs: [] },
  { label: "Partner Program", faqs: [] },
  { label: "Help & Support", faqs: [] },
];

const steps = [
  {
    title: "Place an Order!",
    desc: "Place order through our website or Mobile app",
    img: image1,
  },
  {
    title: "Track Progress",
    desc: "Your can track your order status with delivery time",
    img: offer1,
  },
  {
    title: "Get your Order!",
    desc: "Receive your order at a lighting fast speed!",
    img: offer2,
  },
];

export default function BottomCard() {
  const [activeTab, setActiveTab] = useState(0);
  const faqs = faqTabs[activeTab].faqs;

  return (
    <div className="bottom-card-outer">
      <h2 className="bottom-card-title">Know more about us!</h2>
      <div className="bottom-card-tabs">
        {faqTabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`bottom-card-tab${activeTab === idx ? " active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bottom-card-container">
        <div className="bottom-card-faqs">
          <ul className="faq-list">
            {faqs.length === 0 ? (
              <li className="faq-empty">Coming soon...</li>
            ) : (
              faqs.map((item, idx) => (
                <li
                  key={idx}
                  className={item.highlight ? "faq-highlight" : ""}
                >
                  {item.q}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="bottom-card-steps">
          <div className="steps-row">
            {steps.map((step, idx) => (
              <div className="step-card" key={idx}>
                <img src={step.img} alt={step.title} className="step-img" />
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="desc bottom-card-desc">
            Order.UK simplifies the food ordering process. Browse through our diverse menu, select your favorite dishes, and proceed to checkout. Your delicious meal will be on its way to your doorstep in no time!
          </div>
        </div>
      </div>
    </div>
  );
} 