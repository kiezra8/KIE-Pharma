import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Camera, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ProductGrid from './ProductGrid';
import { pickAndUploadImage } from '../utils/imageUtils';
import './Categories.css';

// 100% INSTANT-ON CATEGORIES (Like suit-up.pages.dev)
const HARDCODED_DATA = [
  { id: 1, name: "Drugs", img: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg" },
  { id: 2, name: "Consumables", img: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg" },
  { id: 3, name: "Surgical", img: "https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300" },
  { id: 4, name: "Orthopedics", img: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg" },
  { id: 5, name: "Laboratory", img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300" },
  { id: 6, name: "Diagnostics", img: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg" },
  { id: 7, name: "Equipment", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200" },
  { id: 8, name: "Radiology", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300" },
  { id: 9, name: "Nursing", img: "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=300" },
  { id: 10, name: "Health Kits", img: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=300" }
];

export default function Categories({ isPage, onToggle, isAdmin }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [categories, setCategories] = useState(HARDCODED_DATA);
  const [subcategories, setSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sync, setSync] = useState(0);

  // FETCH SUPPLEMENTAL DATA (Classes & Products)
  useEffect(() => {
    async function fetchInventory() {
      const { data: subs } = await supabase.from('subcategories').select('*');
      const { data: prods } = await supabase.from('products').select('*');
      const { data: cats } = await supabase.from('categories').select('*');
      
      if (subs) setSubcategories(subs);
      if (prods) setAllProducts(prods);
      
      // Merge custom category changes (like new images) if available in DB
      if (cats && cats.length > 0) {
        setCategories(prev => {
          return prev.map(p => {
             const found = cats.find(c => c.name === p.name || Number(c.id) === p.id);
             return found ? { ...p, ...found } : p;
          });
        });
      }
    }
    fetchInventory();
  }, [sync]);

  const handleQuickSwap = async (e, item, table) => {
    e.stopPropagation();
    const url = await pickAndUploadImage();
    if (url) {
       const field = (table === 'products') ? 'image' : 'img';
       await supabase.from(table).update({ [field]: url }).eq('id', item.id);
       setSync(s => s + 1);
    }
  };

  const handleAddCategory = async () => {
    const name = prompt("Category Name:"); if (!name) return;
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('categories').insert([{ name, img: url }]);
    setSync(s => s + 1);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (onToggle) onToggle(true);
  };

  const backToMain = (e) => { 
    if (e) e.stopPropagation(); 
    setActiveCategory(null); setSelectedSub(null); 
    if (onToggle) onToggle(false);
  };
  
  if (selectedSub) {
    const classProducts = allProducts.filter(p => Number(p.subcategory_id) === Number(selectedSub.id));
    return (
      <div className="categories-page-wrapper">
        <button className="back-line-btn" onClick={() => setSelectedSub(null)}>
          <ArrowLeft size={18} /> Back to {activeCategory.name}
        </button>
        <ProductGrid title={selectedSub.name} products={classProducts} isAdmin={isAdmin} />
      </div>
    );
  }

  if (activeCategory) {
    if (activeCategory.name.toLowerCase() === 'drugs') {
        const subcats = subcategories.filter(s => Number(s.category_id) === Number(activeCategory.id) || Number(s.category_id) === 1);
        return (
          <div className="categories-page-wrapper">
            <button className="back-line-btn" onClick={backToMain}><ArrowLeft size={18} /> Back</button>
            <div className="section-header"><h3 className="section-title">Medical Classes</h3></div>
            <div className="subcategory-grid fade-in">
                {subcats.map(sub => (
                  <div key={sub.id} className="subcategory-card-premium" onClick={() => setSelectedSub(sub)}>
                    <div className="sub-card-img">
                      <img src={sub.img || "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg"} alt={sub.name} />
                      {isAdmin && <button className="quick-edit-img-btn" onClick={(e) => handleQuickSwap(e, sub, 'subcategories')}><Camera size={14}/> Change</button>}
                    </div>
                    <div className="sub-card-info"><h4>{sub.name}</h4><ChevronRight size={16} /></div>
                  </div>
                ))}
            </div>
          </div>
        );
    } else {
        const catProducts = allProducts.filter(p => Number(p.category_id) === Number(activeCategory.id));
        return (
          <div className="categories-page-wrapper">
            <button className="back-line-btn" onClick={backToMain}><ArrowLeft size={18} /> Back</button>
            <ProductGrid title={activeCategory.name} products={catProducts} isAdmin={isAdmin} />
          </div>
        );
    }
  }

  if (isPage) {
    return (
      <div className="categories-page-wrapper">
        <div className="section-header">
            <h3 className="section-title">Departments</h3>
            {isAdmin && <button className="in-app-add-btn" onClick={handleAddCategory}><Plus size={16}/> New Dept</button>}
        </div>
        <div className="categories-list">
          {categories.map(cat => (
            <div key={cat.id} className="category-list-item-premium fade-in" onClick={() => handleCategoryClick(cat)}>
              <img src={cat.img} alt={cat.name} className="cat-list-img" />
              {isAdmin && <button className="quick-edit-img-btn card-style" onClick={(e) => handleQuickSwap(e, cat, 'categories')}><Camera size={16}/> Edit</button>}
              <div className="category-list-overlay">
                <div className="category-list-content"><h4>{cat.name}</h4><p>Browse Stock</p></div>
                <ChevronRight size={24} />
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
        <div className="section-header"><h3 className="section-title">Shop by Category</h3></div>
        <div className="categories-scroll-container">
          {categories.map(cat => (
            <div key={cat.id} className="category-item-circular" onClick={() => handleCategoryClick(cat)}>
              <div className="category-circle-img">
                <img src={cat.img} alt={cat.name} className="cat-img-grid" />
                {isAdmin && <button className="quick-edit-img-btn small" onClick={(e) => handleQuickSwap(e, cat, 'categories')}><Camera size={12}/></button>}
              </div>
              <span className="category-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
