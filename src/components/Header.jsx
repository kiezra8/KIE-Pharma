import React, { useState } from 'react';
import { Search, Heart, User, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header({ onSearch }) {
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo" onClick={() => window.location.reload()}>
          SkieZ Pharma {isAdmin && <span className="admin-status-pill">ADMIN MODE</span>}
        </div>
        <div className="header-icons">
          <div className="wishlist-header-icon">
            <Heart size={20} color="#333" strokeWidth={2.5} />
          </div>
          <div className="account-header-icon">
            <Bell size={20} color="#333" strokeWidth={2.5} />
            {cartCount > 0 && <span className="wishlist-badge">{cartCount}</span>}
          </div>
        </div>
      </div>
      <div className="search-bar">
        <Search size={18} color="#999" />
        <input 
          type="text" 
          placeholder="Search medical supplies..." 
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </header>
  );
}
