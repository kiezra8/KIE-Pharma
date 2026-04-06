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
      <div className="detail-header-jumia">
        <button className="back-btn" onClick={onClose}><ArrowLeft size={24} /></button>
        <span className="header-title-jumia">Details</span>
        <button className="icon-btn-transparent"><Share2 size={24} /></button>
      </div>

      <div className="detail-content-jumia">
        {/* Gallery Section */}
        <div className="gallery-container-jumia">
          <div className="wishlist-float-jumia">
            <Heart size={20} color="#f68b1e" />
          </div>
          <img src={activeImage} alt={product.name} className="main-gallery-img" />
          <div className="gallery-dots-jumia">
            {gallery.map((img, idx) => (
              <span 
                key={idx} 
                className={`jumia-dot ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info Section Jumia */}
        <div className="info-container-jumia">
          <div className="jumia-title-block">
            <h1 className="product-title-jumia">{product.name}</h1>
            <div className="rating-row-jumia">
              <div className="stars">
                <Star size={14} fill="#f68b1e" color="#f68b1e" />
                <Star size={14} fill="#f68b1e" color="#f68b1e" />
                <Star size={14} fill="#f68b1e" color="#f68b1e" />
                <Star size={14} fill="#f68b1e" color="#f68b1e" />
                <Star size={14} fill="#f68b1e" color="#e0e0e0" />
                <span className="rating-text-jumia">120 verified ratings</span>
              </div>
            </div>
            <div className="price-row-jumia">
              <h2>UGX {Number(product.price || 0).toLocaleString()}</h2>
              {product.badge && <span className="jumia-badge-express">KIE EXPRESS</span>}
            </div>
          </div>
          
          <div className="jumia-section-divider"></div>

          <div className="jumia-delivery-block">
             <h3 className="jumia-block-title">DELIVERY & RETURNS</h3>
             
             <div className="jumia-delivery-item">
               <div className="jumia-delivery-icon-box"><Truck size={20} color="#f68b1e" /></div>
               <div className="delivery-text">
                 <h4>Door Delivery</h4>
                 <p>Delivery Fees UGX 3,000</p>
               </div>
             </div>
             
             <div className="jumia-delivery-item">
               <div className="jumia-delivery-icon-box"><RefreshCcw size={20} color="#f68b1e" /></div>
               <div className="delivery-text">
                 <h4>Return Policy</h4>
                 <p>Free return within 7 days for eligible items.</p>
               </div>
             </div>
             
             <div className="jumia-delivery-item">
               <div className="jumia-delivery-icon-box"><ShieldCheck size={20} color="#f68b1e" /></div>
               <div className="delivery-text">
                 <h4>Warranty</h4>
                 <p>100% Authentic items guaranteed by SkieZ.</p>
               </div>
             </div>
          </div>

          <div className="jumia-section-divider"></div>

          <div className="jumia-description-block">
            <h3 className="jumia-block-title">PRODUCT DETAILS</h3>
            <div className="jumia-desc-text">
              <p>{product.description || product.desc || 'High-quality medical supplies guaranteed by SkieZ Pharma. Sterilized and verified for immediate clinical application.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar-jumia">
        <button className="icon-action-jumia"><Share2 size={20} color="#666" /></button>
        <button className="add-to-cart-jumia" onClick={() => { addToCart(product); onClose(); }}>
          <ShoppingBag size={18} />
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
