import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Share2, Star, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail({ product, onClose }) {
  const { addToCart } = useCart();
  const imgUrl = product.imageurl || product.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600";
  const [activeImage, setActiveImage] = useState(imgUrl);
  
  const gallery = product.gallery?.length ? product.gallery : [
    imgUrl,
    "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div className="product-detail-modal slide-up">
      <div className="detail-header-suitup">
        <button className="back-btn" onClick={onClose}><ArrowLeft size={24} /></button>
        <span className="header-title-suitup">PRODUCT DETAILS</span>
        <button className="icon-btn-transparent"><Share2 size={24} /></button>
      </div>

      <div className="detail-content-suitup">
        {/* Gallery Section */}
        <div className="gallery-container-suitup">
          <div className="wishlist-float-suitup">
            <Heart size={20} color="var(--primary)" />
          </div>
          <img src={activeImage} alt={product.name} className="main-gallery-img" />
          <div className="gallery-dots-suitup">
            {gallery.map((img, idx) => (
              <span 
                key={idx} 
                className={`suitup-dot ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-container-suitup">
          <div className="suitup-title-block">
            <h1 className="product-title-suitup">{product.name}</h1>
            <div className="rating-row-suitup">
              <div className="stars">
                <Star size={14} fill="var(--primary)" color="var(--primary)" />
                <Star size={14} fill="var(--primary)" color="var(--primary)" />
                <Star size={14} fill="var(--primary)" color="var(--primary)" />
                <Star size={14} fill="var(--primary)" color="var(--primary)" />
                <Star size={14} fill="var(--primary)" color="#e0e0e0" />
                <span className="rating-text-suitup">120+ Verified Clinical Reviews</span>
              </div>
            </div>
            <div className="price-row-suitup">
              <h2>UGX {Number(product.price || 0).toLocaleString()}</h2>
              {product.badge && <span className="suitup-badge-express">PREMIUM</span>}
            </div>
          </div>
          
          <div className="suitup-section-divider"></div>

          <div className="suitup-delivery-block">
             <h3 className="suitup-block-title">MEDICAL SERVICE & CARE</h3>
             
             <div className="suitup-delivery-item">
               <div className="suitup-delivery-icon-box"><Truck size={20} color="var(--primary)" /></div>
               <div className="delivery-text">
                 <h4>Standard Clinical Delivery</h4>
                 <p>Flat rate UGX 3,000 across Uganda</p>
               </div>
             </div>
             
             <div className="suitup-delivery-item">
               <div className="suitup-delivery-icon-box"><RefreshCcw size={20} color="var(--primary)" /></div>
               <div className="delivery-text">
                 <h4>Sterility Guarantee</h4>
                 <p>Tamper-proof packaging and quality checks.</p>
               </div>
             </div>
             
             <div className="suitup-delivery-item">
               <div className="suitup-delivery-icon-box"><ShieldCheck size={20} color="var(--primary)" /></div>
               <div className="delivery-text">
                 <h4>Warranty</h4>
                 <p>100% Authentic medical grade supplies.</p>
               </div>
             </div>
          </div>

          <div className="suitup-section-divider"></div>

          <div className="suitup-description-block">
            <h3 className="suitup-block-title">TECHNICAL SPECIFICATIONS</h3>
            <div className="suitup-desc-text">
              <p>{product.description || product.desc || 'Quality medical grade supply. Fully compliant with modern clinical standards and safety protocols for professional use.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar-suitup">
        <button className="add-to-cart-suitup" onClick={() => { addToCart(product); onClose(); }}>
          <ShoppingBag size={20} />
          ADD TO PHARMA CART
        </button>
      </div>
    </div>
  );
}

