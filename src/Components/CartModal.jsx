import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CartModal.css";

export default function CartModal({ open, onClose }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!open) return null;

  // Calculate subtotal, discount, delivery, total
  const subtotal = getTotalPrice();
  const discount = subtotal > 500 ? 50 : 0; // ₹50 off for orders over ₹500
  const delivery = subtotal > 0 ? 25 : 0; // ₹25 delivery charge
  const total = subtotal - discount + delivery;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert(
      `Checkout Total: ₹${total.toFixed(2)}\nCheckout functionality coming soon!`,
    );
    // Future: Redirect to checkout page
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, parseInt(newQuantity));
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="cart-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>My Basket</h2>
        {cartItems.length === 0 ? (
          <div className="cart-modal-empty">Your cart is empty.</div>
        ) : (
          <>
            <ul className="cart-modal-list">
              {cartItems.map((item) => {
                const itemId = item.id || item._id;
                const itemPrice = parseFloat(
                  item.price?.toString().replace(/[^0-9.]/g, "") || 0,
                );
                return (
                  <li key={itemId} className="cart-modal-item">
                    <div className="cart-item-info">
                      <span className="cart-item-title">
                        {item.title || item.name}
                      </span>
                      {(item.desc || item.description) && (
                        <span className="cart-item-desc">
                          {item.desc || item.description}
                        </span>
                      )}
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-item-price-qty">
                        <span className="cart-item-price">
                          ₹{itemPrice.toFixed(2)}
                        </span>
                        <div className="cart-quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(
                                itemId,
                                (item.quantity || 1) - 1,
                              )
                            }
                          >
                            -
                          </button>
                          <span className="cart-item-qty">
                            {item.quantity || 1}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(
                                itemId,
                                (item.quantity || 1) + 1,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="cart-modal-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="cart-bill">
              <div className="cart-bill-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-bill-row">
                  <span>Discount</span>
                  <span style={{ color: "#28a745" }}>
                    -₹{discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="cart-bill-row">
                <span>Delivery</span>
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div className="cart-bill-row cart-bill-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="cart-modal-actions">
              <button
                className="cart-modal-clear"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </button>
              <button
                className="cart-modal-checkout"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Checkout (₹{total.toFixed(2)})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
