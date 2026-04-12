import React, { useState } from 'react';
import { Heart, Plus, Edit3, Trash2, X, Check, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetail from './ProductDetail';
import { pickAndUploadImage } from '../utils/imageUtils';
import { supabase } from '../supabaseClient';
import './ProductGrid.css';

export default function ProductGrid({ title, products, isAdmin }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({});

  const handleCreate = async () => {
    const name = prompt("Name:"); if (!name) return;
    const price = prompt("Price (UGX):", "0");
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('products').insert([{ name, price: Number(price), image: url }]);
    window.location.reload();
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    await supabase.from('products').update(formData).eq('id', editProduct.id);
    setEditProduct(null);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete?")) {
        await supabase.from('products').delete().eq('id', id);
        window.location.reload();
    }
  };

  return (
    <section className="products-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {isAdmin && <button className="in-app-add-btn" onClick={handleCreate}><Plus size={16}/> New Product</button>}
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              {isAdmin && (
                 <button className="quick-edit-img-btn" onClick={(e) => { e.stopPropagation(); setEditProduct(product); setFormData(product); }}>
                   <Edit3 size={14}/> Manage
                 </button>
              )}
              {product.badge && <span className="product-discount">{product.badge}</span>}
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <div className="product-price-row">
                <span className="product-price">Ugshs {Number(product.price).toLocaleString()}</span>
              </div>
              <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-add-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>ADD TO CART</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <div className="pro-live-modal-overlay" onClick={() => setEditProduct(null)}>
           <div className="pro-live-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-top">
                 <h3>Edit Product Record</h3>
                 <button onClick={() => setEditProduct(null)}><X /></button>
              </div>
              <form onSubmit={handleEditSave}>
                 <div className="edit-img-slot" onClick={async () => { const url = await pickAndUploadImage(); if (url) setFormData({...formData, image: url}); }}>
                    <img src={formData.image} alt="p" />
                    <div className="img-slot-overlay"><Camera size={20}/> Change Photo</div>
                 </div>
                 <div className="input-group"><label>Product Name</label><input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                 <div className="input-group"><label>Price (UGX)</label><input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                 <div className="input-group"><label>Drug Class ID</label><input type="number" value={formData.subcategory_id || 0} onChange={e => setFormData({...formData, subcategory_id: Number(e.target.value)})} /></div>
                 <div className="modal-actions">
                    <button type="submit" className="save-live-btn"><Check size={18}/> Update Product</button>
                    <button type="button" className="del-live-btn" onClick={() => handleDelete(editProduct.id)}><Trash2 size={16}/></button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}
