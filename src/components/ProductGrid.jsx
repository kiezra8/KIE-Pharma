import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductGrid.css';

export default function ProductGrid({ title, products }) {
  const { addToCart } = useCart();

  return (
    <section className="products-section">
      <h3 className="section-title">{title}</h3>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <div className="product-wishlist" onClick={(e) => e.stopPropagation()}>
                <Heart size={16} strokeWidth={1.5} />
              </div>
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <div className="product-price-row">
                <span className="product-price">
                  <span className="product-price-symbol">UShs</span>{product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
