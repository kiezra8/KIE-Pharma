import React from 'react';
import { Search, ShoppingBag, User, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-topline">
          <div className="header-left">
            <MessageCircle size={22} strokeWidth={1.5} />
          </div>
          <div className="logo-container">
            <h1 className="logo-text">KIE PHARMA</h1>
          </div>
          <div className="header-right">
            <User size={22} strokeWidth={1.5} />
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
        <div className="header-search-container">
          <div className="search-bar-shein">
            <Search size={18} className="search-icon-shein" />
            <input type="text" placeholder="Search for medical products..." className="search-input-shein" />
            <div className="search-tags-hint">Masks, Gloves...</div>
          </div>
        </div>
      </div>
    </header>
  );
}
