import React, { useState } from 'react';
import { Home, Grid, ShoppingBag, MessageCircle, User, Phone, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './BottomNav.css';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { cartCount } = useCart();
  const [showChatOptions, setShowChatOptions] = useState(false);

  const handleChatOpen = () => setShowChatOptions(true);
  const handleChatClose = () => setShowChatOptions(false);

  return (
    <>
      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span>Home</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Grid size={22} strokeWidth={activeTab === 'categories' ? 2.5 : 2} />
          <span>Categories</span>
        </div>
        <div 
          className={`nav-item nav-cart ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <ShoppingBag size={22} strokeWidth={activeTab === 'cart' ? 2.5 : 2} />
          <span>Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <div 
          className={`nav-item ${showChatOptions ? 'active' : ''}`}
          onClick={handleChatOpen}
        >
          <MessageCircle size={22} strokeWidth={showChatOptions ? 2.5 : 2} />
          <span>Chat</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={22} strokeWidth={activeTab === 'account' ? 2.5 : 2} />
          <span>Account</span>
        </div>
      </nav>

      {/* Chat Options Modal - matching Suit Up dark modal logic */}
      {showChatOptions && (
        <div className="chat-modal-overlay" onClick={handleChatClose}>
          <div className="chat-modal-content" onClick={e => e.stopPropagation()}>
            <div className="chat-modal-header">
              <h3>Connect with Us</h3>
              <button className="chat-close" onClick={handleChatClose}><X size={20}/></button>
            </div>
            <p>Our medical specialists are on standby to assist you.</p>
            <div className="chat-options">
              <a href="https://wa.me/256702370441" target="_blank" rel="noopener noreferrer" className="chat-option whatsapp">
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a href="tel:+256702370441" className="chat-option call">
                <Phone size={20} />
                Direct Call
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
