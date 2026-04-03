import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Share2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail({ product, onClose }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.imageurl || product.image);
  
  // Fake gallery for visuals if not provided by Supabase yet
  const gallery = product.gallery?.length ? product.gallery : [
    product.imageurl || product.image,
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div className="product-detail-modal slide-up">
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}><ArrowLeft size={24} /></button>
        <div className="header-actions">
          <button className="icon-btn"><Share2 size={20} /></button>
          <button className="icon-btn"><Heart size={20} /></button>
        </div>
      </div>

      <div className="detail-content">
        {/* Gallery Section */}
        <div className="gallery-container">
          <img src={activeImage} alt={product.name} className="main-gallery-img" />
          <div className="gallery-thumbnails">
            {gallery.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Thumbnail" 
                className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-container">
          <div className="price-row">
            <h2>Ugshs {Number(product.price).toLocaleString()}</h2>
            {product.badge && <span className="flash-sale-badge">{product.badge}</span>}
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-row">
            <div className="stars">
              <Star size={14} fill="#ffc107" color="#ffc107" />
              <Star size={14} fill="#ffc107" color="#ffc107" />
              <Star size={14} fill="#ffc107" color="#ffc107" />
              <Star size={14} fill="#ffc107" color="#ffc107" />
              <Star size={14} fill="#ffc107" color="#ffc107" />
              <span>(4.9)</span>
            </div>
            <span className="sold-count">1.2k+ Sold</span>
          </div>

          {/* Shein-style Accordion/Specs */}
          <div className="specs-section">
            <div className="spec-row">
              <span className="spec-label">Shipping</span>
              <span className="spec-value">Express Delivery (24hrs)</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Returns</span>
              <span className="spec-value">7 Days Free Return if sealed</span>
            </div>
          </div>

          <div className="description-section">
            <h3>Product Description</h3>
            <p>{product.description || 'High-quality medical supplies guaranteed by SkieZ Pharma. Sterilized and verified for immediate clinical application.'}</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar">
        <button className="add-to-cart-btn" onClick={() => { addToCart(product); onClose(); }}>
          <ShoppingBag size={20} />
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
