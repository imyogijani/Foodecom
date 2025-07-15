import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartModal.css";
import { getCartByUserAPI, updateCartItemAPI } from "../api/cartApi/cartApi";
import { toast } from "react-toastify";
export default function CartModal({ open, onClose }) {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [hoveredItem, setHoveredItem] = useState(null);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await getCartByUserAPI(userId);
        setCartData(response);
        console.log("Cart Moadal", response);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast.error("Failed to fetch cart");
      }
    };

    if (open) fetchCart();
  }, [open, userId]);

  if (!open) return null;
  if (loading) return <div className="cart-modal-overlay">Loading...</div>;

  const { cart, totalPrice } = cartData;
  const items = cart.items || [];

  // console.log("Cart items data set other variable", items);
  // Calculate subtotal, discount, delivery, total
  const subtotal = totalPrice || 0;
  const discount = subtotal > 500 ? 50 : 0;
  const delivery = subtotal > 0 ? 25 : 0;
  const total = subtotal - discount + delivery;

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    navigate("/checkout");
  };

  // const handleQuantityChange = (itemId, newQuantity) => {
  //   updateQuantity(itemId, parseInt(newQuantity));
  // };
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItemAPI(userId, productId, newQuantity);
      // toast.success("Quantity updated!");

      //  Live update local cart state without re-fetching
      setCartData((prevCartData) => {
        const updatedItems = prevCartData.cart.items.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        // Recalculate totalPrice
        const newTotalPrice = updatedItems.reduce((acc, item) => {
          return acc + item.quantity * item.price;
        }, 0);

        return {
          ...prevCartData,
          cart: {
            ...prevCartData.cart,
            items: updatedItems,
          },
          totalPrice: newTotalPrice,
        };
      });
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="cart-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>My Basket</h2>
        {items.length === 0 ? (
          <div className="cart-modal-empty">Your cart is empty.</div>
        ) : (
          <>
            <ul className="cart-modal-list">
              {items.map((item) => {
                const itemId = item.productId;
                const itemPrice = parseFloat(
                  item.price?.toString().replace(/[^0-9.]/g, "") || 0
                );

                return (
                  <li key={itemId} className="cart-modal-item">
                    <div className="cart-item-info">
                      <span className="cart-item-title">{item.title}</span>
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
                              handleQuantityChange(itemId, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="cart-item-qty">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(itemId, item.quantity + 1)
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
