import React from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const WHATSAPP_NUMBER = "+256702370441"; // Number is hidden from UI

export default function Cart() {
  const { cart, addToCart, removeFromCart, cartTotal, cartCount, clearCart } = useCart();

  const handleOrder = () => {
    const itemsText = cart.map(item => `- ${item.name} (${item.quantity}x): Ugshs ${(item.price * item.quantity).toLocaleString()}`).join('%0A');
    const totalText = `Total: Ugshs ${cartTotal.toLocaleString()}`;
    const message = `Hello SkieZ Pharma! New Order Request:%0A%0A${itemsText}%0A%0A${totalText}%0A%0A Please confirm receipt.`.replace(/ /g, '%20');
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  if (cartCount === 0) {
    return (
      <div className="empty-cart fade-in">
        <div className="empty-icon">
          <ShoppingBag size={64} color="#ccc" />
        </div>
        <h2>Your cart is empty</h2>
        <p>Browse our pharmaceutical catalog to add items.</p>
        <button className="back-shopping-btn" onClick={() => window.location.reload()}>Start Shopping</button>
      </div>
    );
  }

  return (
    <section className="cart-page fade-in">
      <div className="cart-header-top">
        <h3 className="cart-title">Shopping Bag ({cartCount})</h3>
        <button className="clear-btn" onClick={clearCart}>Clear All</button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image-box">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-price">Ugshs {item.price.toLocaleString()}</p>
              <div className="quantity-controls">
                <button onClick={() => removeFromCart(item.id)}><Minus size={14} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}><Plus size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <div className="total-row">
          <span>Subtotal</span>
          <span>Ugshs {cartTotal.toLocaleString()}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span style={{color: '#ff6b6b', fontWeight: 700}}>FREE</span>
        </div>
        <div className="total-row final">
          <span>Total</span>
          <span>Ugshs {cartTotal.toLocaleString()}</span>
        </div>
      </div>
      
      <button className="order-whatsapp-btn" onClick={handleOrder}>
        <i className="fa-brands fa-whatsapp"></i> Buy via WhatsApp
      </button>
      <p className="order-disclaimer">Your order will be sent securely to our dispensary.</p>
    </section>
  );
}
