import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductGrid.css';

export default function ProductGrid({ title, products }) {
  const { addToCart } = useCart();

  return (
    <section className="products-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              {product.badge && <span className="product-discount">{product.badge}</span>}
              <div className="product-wishlist">
                <Heart size={16} />
              </div>
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <div className="product-price-row">
                <span className="product-price">Ugshs {product.price.toLocaleString()}</span>
              </div>
              <div className="product-actions">
                <button className="btn-add-cart" onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
