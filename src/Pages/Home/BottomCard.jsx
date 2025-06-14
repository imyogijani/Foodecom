import React, { useState } from "react";
import "./BottomCard.css";
import image1 from "../../images/image1.png";
import offer1 from "../../images/image2.png";
import offer2 from "../../images/image.png";

const faqTabs = [
  {
    label: "Frequent Questions",
    faqs: [
      {
        q: "How does Order.UK work?",
        a: "Order.UK connects you with local restaurants and stores. Browse the menu, place your order online or via our app, and get your food delivered quickly to your doorstep.",
        highlight: true,
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards, digital wallets (like Google Pay, Apple Pay), and sometimes cash on delivery depending on the restaurant.",
      },
      {
        q: "Can I track my order in real-time?",
        a: "Yes! After placing your order, you can track its status and delivery time in real-time from your account dashboard or the app.",
      },
      {
        q: "Are there any special discounts or promotions available?",
        a: "Yes, we regularly offer exclusive deals and discounts. Check the 'Special Offers' section or subscribe to our newsletter for updates.",
      },
      {
        q: "Is Order.UK available in my area?",
        a: "Order.UK is available in most major cities and towns. Enter your postcode on our homepage to check availability in your area.",
      },
    ],
  },
  {
    label: "Who we are?",
    faqs: [
      {
        q: "Who is behind Order.UK?",
        a: "Order.UK is a passionate team dedicated to making food delivery fast, easy, and enjoyable for everyone.",
      },
      {
        q: "What is the mission of Order.UK?",
        a: "Our mission is to connect people with great food from their favorite local restaurants, delivered quickly and reliably.",
      },
    ],
  },
  {
    label: "Partner Program",
    faqs: [
      {
        q: "How can I partner with Order.UK?",
        a: "If you own a restaurant or store, you can join our platform by signing up through the 'Partner with us' section. We’ll guide you through the onboarding process.",
      },
      {
        q: "What are the benefits of partnering?",
        a: "Partners get access to a wider customer base, marketing support, and advanced order management tools.",
      },
    ],
  },
  {
    label: "Help & Support",
    faqs: [
      {
        q: "How do I contact customer support?",
        a: "You can reach our support team via the 'Help & Support' section on our website or app, or email us at support@order.uk.",
      },
      {
        q: "What if I have an issue with my order?",
        a: "If you face any issues, please contact us immediately through your order page or support. We’ll resolve it as quickly as possible.",
      },
    ],
  },
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
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = faqTabs[activeTab].faqs;

  const handleFaqClick = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bottom-card-outer">
      <h2 className="bottom-card-title">Know more about us!</h2>
      <div className="bottom-card-tabs">
        {faqTabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`bottom-card-tab${activeTab === idx ? " active" : ""}`}
            onClick={() => {
              setActiveTab(idx);
              setOpenFaq(null);
            }}
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
                  className={""}
                  onClick={() => handleFaqClick(idx)}
                  style={{ cursor: "pointer" }}
                >
                  {item.q}
                  {openFaq === idx && item.a && (
                    <div className="faq-answer">{item.a}</div>
                  )}
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
            Order.UK simplifies the food ordering process. Browse through our
            diverse menu, select your favorite dishes, and proceed to checkout.
            Your delicious meal will be on its way to your doorstep in no time!
          </div>
        </div>
      </div>
    </div>
  );
}