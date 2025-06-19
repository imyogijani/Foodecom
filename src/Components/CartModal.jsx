import React from "react";
import { useCart } from "../context/CartContext";
import "./CartModal.css";

export default function CartModal({ open, onClose }) {
  const { cartItems, removeFromCart } = useCart();

  if (!open) return null;

  // Calculate subtotal, discount, delivery, total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const discount = subtotal > 30 ? 5 : 0; // Example: £5 off for orders over £30
  const delivery = subtotal > 0 ? 2.5 : 0;
  const total = subtotal - discount + delivery;

  const handleCheckout = () => {
    alert("Checkout coming soon!");
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="cart-modal-close" onClick={onClose}>&times;</button>
        <h2>My Basket</h2>
        {cartItems.length === 0 ? (
          <div className="cart-modal-empty">Your cart is empty.</div>
        ) : (
          <>
            <ul className="cart-modal-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-modal-item">
                  <span>{item.name}</span>
                  <span>£{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} className="cart-modal-remove">Remove</button>
                </li>
              ))}
            </ul>
            <div className="cart-bill">
              <div className="cart-bill-row">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-bill-row">
                <span>Discount</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
              <div className="cart-bill-row">
                <span>Delivery</span>
                <span>£{delivery.toFixed(2)}</span>
              </div>
              <div className="cart-bill-row cart-bill-total">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="cart-modal-checkout" onClick={handleCheckout} disabled={cartItems.length === 0}>
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
} 