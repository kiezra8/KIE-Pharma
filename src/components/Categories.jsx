import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductGrid from './ProductGrid';
import './Categories.css';

const mainCategories = [
  { id: 1, name: "Drugs", image: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg" },
  { id: 2, name: "Consumables", image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg" },
  { id: 3, name: "Lab Equip", image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg" },
  { id: 4, name: "Orthopedics", image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Surgical", image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg" },
  { id: 6, name: "First Aid", image: "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=600" },
  { id: 7, name: "PPE", image: "https://images.unsplash.com/photo-1586985289906-406988974504?auto=format&fit=crop&q=80&w=600" },
  { id: 8, name: "Disinfectants", image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=600" },
  { id: 9, name: "Diagnostics", image: "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=600" },
  { id: 10, name: "Other", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600" }
];

const drugSubcategories = [
  { id: 'analgesics', name: "Analgesics & Antipyretics", desc: "Pain and fever relief", img: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg" },
  { id: 'antibiotics', name: "Antibiotics & Antibacterials", desc: "For bacterial infections", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antifungals', name: "Antifungals", desc: "For fungal relief", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antimalarials', name: "Antimalarials", desc: "For malaria cure", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antivirals', name: "Antivirals", desc: "Combat viral growth", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'anthelmintics', name: "Anthelmintics", desc: "De-wormers", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antihypertensives', name: "Antihypertensives", desc: "BP medication", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antidiabetics', name: "Antidiabetics", desc: "Sugar control", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antihistamines', name: "Antihistamines", desc: "Allergy relief", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antacids', name: "Antacids & Antiulcerants", desc: "Stomach ulcers", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'antiasthmatics', name: "Antiasthmatics", desc: "Asthma management", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'cardiovascular', name: "Cardiovascular Drugs", desc: "Heart conditions", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'corticosteroids', name: "Corticosteroids", desc: "Steroid hormones", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'dermatologicals', name: "Dermatologicals", desc: "Skin treatment", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'diuretics', name: "Diuretics", desc: "Water pills", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'gastrointestinal', name: "Gastrointestinal Drugs", desc: "Digestive system", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'hormones', name: "Hormones & Endocrine", desc: "Hormonal therapy", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'immunosuppressants', name: "Immunosuppressants", desc: "Immune support", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'neurological', name: "Neurological Drugs", desc: "Nervous system", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'psychotropics', name: "Psychotropics", desc: "Mental health", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'supplements', name: "Supplements & Vitamins", desc: "Healthy supplements", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'vaccines', name: "Vaccines & Sera", desc: "Immunizations", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'respiratory', name: "Respiratory Drugs", desc: "Breathing treatment", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'ophthalmic', name: "Ophthalmic Drops", desc: "Eye care", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 'otic', name: "Otic Drops", desc: "Ear treatment", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" }
];

const drugProducts = [
  // Analgesics
  { id: 1001, subId: 'analgesics', name: "Paracetamol 500mg", desc: "Fast pain relief (100 Tabs)", price: 5000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "Popular" },
  { id: 1002, subId: 'analgesics', name: "Ibuprofen 400mg", desc: "Anti-inflammatory painkiller", price: 8500, image: "https://images.unsplash.com/photo-1583947581924-860bda6a5d0e?auto=format&fit=crop&q=80&w=300" },
  { id: 1003, subId: 'analgesics', name: "Diclofenac Sodium 50mg", desc: "For joint and muscle pain", price: 6000, image: "https://images.unsplash.com/photo-1550572017-edb78996b797?auto=format&fit=crop&q=80&w=300" },
  
  // Antibiotics
  { id: 1004, subId: 'antibiotics', name: "Amoxicillin 500mg", desc: "Broad spectrum antibiotic", price: 15000, image: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg", badge: "Common" },
  { id: 1005, subId: 'antibiotics', name: "Ciprofloxacin 500mg", desc: "Strong antibiotic", price: 25000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 1006, subId: 'antibiotics', name: "Azithromycin 500mg", desc: "Macrolide antibiotic", price: 30000, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300", badge: "Hot" },
  
  // Antimalarials
  { id: 1007, subId: 'antimalarials', name: "Artemether-Lumefantrine", desc: "First-line malaria treatment", price: 18000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300", badge: "Essential" },
  { id: 1008, subId: 'antimalarials', name: "Quinine Sulphate 300mg", desc: "Severe malaria management", price: 22000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  
  // Supplements
  { id: 1009, subId: 'supplements', name: "Vitamin C Tablets 1000mg", desc: "Immune booster", price: 12000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 1010, subId: 'supplements', name: "Zinc Sulphate 20mg", desc: "Essential trace element", price: 9000, image: "https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300" },
  { id: 1011, subId: 'supplements', name: "Multivitamin Syrup", desc: "Daily dietary supplement", price: 18500, image: "https://images.unsplash.com/photo-1550572017-48f86f6a7d77?auto=format&fit=crop&q=80&w=300" },

  // Cardiovascular
  { id: 1012, subId: 'cardiovascular', name: "Amlodipine 5mg", desc: "Calcium channel blocker", price: 14000, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300" },
  { id: 1013, subId: 'cardiovascular', name: "Losartan 50mg", desc: "Blood pressure management", price: 21000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },

  // Antidiabetics
  { id: 1014, subId: 'antidiabetics', name: "Metformin 500mg", desc: "Type 2 diabetes management", price: 11000, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300" },
  
  // Ophthalmic
  { id: 1015, subId: 'ophthalmic', name: "Timolol Eye Drops 0.5%", desc: "Glaucoma relief drops", price: 16500, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
  { id: 1016, subId: 'ophthalmic', name: "Ciprofloxacin Eye Drops", desc: "Antibacterial eye protection", price: 13000, image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=300" }
];

export default function Categories({ isPage, onToggle }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.name.toLowerCase());
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
    const classProducts = drugProducts.filter(p => p.subId === selectedSub.id);

    return (
      <div className="categories-page-wrapper">
        <button className="back-line-btn" onClick={backToSub}>
          <ArrowLeft size={18} /> Back to {activeCategory}
        </button>
        {classProducts.length > 0 ? (
          <ProductGrid title={selectedSub.name} products={classProducts} />
        ) : (
          <div>
            <div className="section-header">
              <h3 className="section-title">{selectedSub.name}</h3>
            </div>
            <div className="empty-category-state fade-in" style={{ textAlign: 'center', padding: '40px 20px', color: '#666', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" style={{width: '100px', borderRadius: '20px', marginBottom: '20px', opacity: '0.4'}} alt="Empty" />
              <h4 style={{fontSize: '18px', color: '#333'}}>No products yet</h4>
              <p style={{fontSize: '13px', marginTop: '8px'}}>Products in this category are coming soon.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeCategory) {
    const isDrugs = activeCategory.toLowerCase() === 'drugs';
    const subcats = isDrugs ? drugSubcategories : [];

    return (
      <div className="categories-page-wrapper">
        <button className="back-line-btn" onClick={backToMain}>
          <ArrowLeft size={18} /> Back to Categories
        </button>
        <div className="section-header">
          <h3 className="section-title">{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} {isDrugs && "Classes"}</h3>
        </div>
        {subcats.length > 0 ? (
          <div className="subcategory-grid fade-in">
            {subcats.map(sub => (
              <div key={sub.id} className="subcategory-card-premium" onClick={() => setSelectedSub(sub)}>
                <div className="sub-card-img">
                  <img src={sub.img || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300"} alt={sub.name} />
                </div>
                <div className="sub-card-info">
                  <h4>{sub.name}</h4>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-category-state fade-in" style={{ textAlign: 'center', padding: '40px 20px', color: '#666', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" style={{width: '100px', borderRadius: '20px', marginBottom: '20px', opacity: '0.4'}} alt="Empty" />
            <h4 style={{fontSize: '18px', color: '#333'}}>No products yet</h4>
            <p style={{fontSize: '13px', marginTop: '8px'}}>Products in this category are coming soon.</p>
          </div>
        )}
      </div>
    );
  }

  if (isPage) {
    return (
      <div className="categories-page-wrapper">
        <div className="section-header">
          <h3 className="section-title">Store Categories</h3>
        </div>
        <div className="categories-list">
          {mainCategories.map(cat => (
            <div key={cat.id} className="category-list-item-premium fade-in" onClick={() => handleCategoryClick(cat)}>
              <img src={cat.image} alt={cat.name} className="cat-list-img" />
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
          {mainCategories.map(cat => (
            <div key={cat.id} className="category-item-circular" onClick={() => handleCategoryClick(cat)}>
              <div className="category-circle-img">
                <img src={cat.image} alt={cat.name} className="cat-img-grid" />
              </div>
              <span className="category-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
