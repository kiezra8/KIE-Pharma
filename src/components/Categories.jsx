import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ProductGrid from './ProductGrid';
import './Categories.css';

const fallbackCategories = [
  { id: 1, name: "Drugs", img: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg" },
  { id: 2, name: "Consumables", img: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg" },
  { id: 3, name: "Surgical", img: "https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300" },
  { id: 4, name: "Orthopedics", img: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg" },
  { id: 5, name: "Laboratory", img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300" },
  { id: 6, name: "Diagnostics", img: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg" }
];

export default function Categories({ isPage, onToggle }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [categories, setCategories] = useState(fallbackCategories);
  const [subcategories, setSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from('categories').select('*');
      const { data: subs } = await supabase.from('subcategories').select('*');
      const { data: prods } = await supabase.from('products').select('*');
      
      // Filter out broken Categories (Dental/Nursing)
      if (cats) {
        const filtered = cats.filter(c => !['Dental', 'Nursing'].includes(c.name));
        setCategories(filtered.length > 0 ? filtered : fallbackCategories);
      }
      if (subs) setSubcategories(subs);
      if (prods) setAllProducts(prods);
    }
    fetchData();
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (onToggle) onToggle(true);
  };

  const backToMain = (e) => { 
    if (e) e.stopPropagation(); 
    setActiveCategory(null); 
    setSelectedSub(null); 
    if (onToggle) onToggle(false);
  };
  
  const backToSub = (e) => { 
    if (e) e.stopPropagation(); 
    setSelectedSub(null); 
  };

  if (selectedSub) {
    const classProducts = allProducts.filter(p => p.subcategory_id === selectedSub.id || p.subId === selectedSub.id);
    return (
      <div className="categories-page-wrapper">
        <button className="back-line-btn" onClick={backToSub}>
          <ArrowLeft size={18} /> Back to {activeCategory.name}
        </button>
        {classProducts.length > 0 ? (
          <ProductGrid title={selectedSub.name} products={classProducts} />
        ) : (
          <div>
            <div className="section-header"><h3 className="section-title">{selectedSub.name}</h3></div>
            <div className="empty-category-state fade-in">
              <img src="https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg" alt="Empty" />
              <h4>Coming Soon</h4>
              <p>Stock arriving soon for {selectedSub.name}.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeCategory) {
    const isDrugs = activeCategory.name.toLowerCase() === 'drugs';
    
    if (isDrugs) {
        const subcats = subcategories.filter(s => s.category_id === activeCategory.id || s.category_id === 1);
        return (
          <div className="categories-page-wrapper">
            <button className="back-line-btn" onClick={backToMain}>
              <ArrowLeft size={18} /> Back to Categories
            </button>
            <div className="section-header">
              <h3 className="section-title">{activeCategory.name} Classes</h3>
            </div>
            {subcats.length > 0 ? (
              <div className="subcategory-grid fade-in">
                {subcats.map(sub => (
                  <div key={sub.id} className="subcategory-card-premium" onClick={() => setSelectedSub(sub)}>
                    <div className="sub-card-img">
                      <img src={sub.img || sub.image || "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg"} alt={sub.name} />
                    </div>
                    <div className="sub-card-info">
                      <h4>{sub.name}</h4>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-category-state fade-in">
                <img src={activeCategory.img || activeCategory.image} alt="Empty" />
                <h4>No Classes Found</h4>
              </div>
            )}
          </div>
        );
    } else {
        // Not drugs? Show products directly
        const catProducts = allProducts.filter(p => p.category_id === activeCategory.id);
        return (
          <div className="categories-page-wrapper">
            <button className="back-line-btn" onClick={backToMain}>
              <ArrowLeft size={18} /> Back to Categories
            </button>
            <ProductGrid title={activeCategory.name} products={catProducts} />
          </div>
        );
    }
  }

  if (isPage) {
    return (
      <div className="categories-page-wrapper">
        <div className="section-header">
          <h3 className="section-title">Store Categories</h3>
        </div>
        <div className="categories-list">
          {categories.map(cat => (
            <div key={cat.id} className="category-list-item-premium fade-in" onClick={() => handleCategoryClick(cat)}>
              <img src={cat.img || cat.image} alt={cat.name} className="cat-list-img" />
              <div className="category-list-overlay">
                <div className="category-list-content">
                  <h4>{cat.name}</h4>
                  <p>Browse {cat.name.toLowerCase()}</p>
                </div>
                <ChevronRight size={24} className="cat-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="categories-wrapper">
      <section className="categories-section">
        <div className="section-header">
          <h3 className="section-title">Shop By Category</h3>
        </div>
        <div className="categories-scroll-container">
          {categories.slice(0, 10).map(cat => (
            <div key={cat.id} className="category-item-circular" onClick={() => handleCategoryClick(cat)}>
              <div className="category-circle-img">
                <img src={cat.img || cat.image} alt={cat.name} className="cat-img-grid" />
              </div>
              <span className="category-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
