import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import BottomNav from './components/BottomNav';
import Cart from './components/Cart';
import Admin from './components/Admin';
import Account from './components/Account';
import './App.css';

const trendingProducts = [
  { id: 101, name: "Premium Nitrile Gloves", desc: "AQL 1.5, Powder-Free, Blue", price: 45000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "Hot" },
  { id: 102, name: "Digital Stethoscope V2", desc: "Ultra-precise acoustic amplification", price: 850000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "Trending" },
  { id: 103, name: "Pulse Oximeter Pro", desc: "SPO2 & Heart Rate Monitoring", price: 85000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "New" },
  { id: 104, name: "Medical Penlight", desc: "LED diagnostic tool", price: 12000, image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 105, name: "Hand Sanitizer 5L", desc: "75% Alcohol Hospital Grade", price: 65000, image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=300", badge: "Best Value" },
  { id: 106, name: "Surgical Gowns", desc: "Level 3 protection, Pack of 10", price: 95000, image: "https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 107, name: "Nebulizer Machine", desc: "Compact ultrasonic tech", price: 185000, image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 108, name: "First Aid Scissors", desc: "Stainless steel trauma shears", price: 18000, image: "https://images.unsplash.com/photo-1512753360424-738fd49b3803?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 109, name: "Alcohol Swabs", desc: "Box of 100 sterile pads", price: 8000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 110, name: "Digital Thermometer", desc: "Fast 10s reading", price: 15000, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300", badge: "" }
];

const generalProducts = [
  { id: 201, name: "Blood Pressure Monitor Pro", desc: "Automatic upper arm cuff", price: 120000, image: "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=300", badge: "New" },
  { id: 202, name: "Medical Face Masks", desc: "Box of 50, 3-ply", price: 15000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 203, name: "Infrared Thermometer", desc: "No-contact digital sensor", price: 75000, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 204, name: "Portable First Aid Kit", desc: "Comprehensive 100-piece bag", price: 55000, image: "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=300", badge: "Best Seller" },
  { id: 205, name: "Compression Bandages", desc: "Size 4 inch, elastic", price: 12000, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 206, name: "Saline Solution 500ml", desc: "Sterile IV fluid", price: 5000, image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 207, name: "Cotton Wool 500g", desc: "Absorbent surgical grade", price: 12000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 208, name: "Latex Free Gloves", desc: "Box of 100, sensitive skin", price: 35000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 209, name: "Antiseptic Cream", desc: "Fast wound healing", price: 15000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 210, name: "Ecg Gel 250ml", desc: "Conductive transmission gel", price: 25000, image: "https://images.unsplash.com/photo-1581093593403-3aed3ba662ba?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 211, name: "Medical Goggles", desc: "Clear anti-fog protection", price: 12000, image: "https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 212, name: "Wound Dressing Kit", desc: "Complete sterile set", price: 22000, image: "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 213, name: "Safety Syringes 5ml", desc: "Pack of 100, retractable", price: 45000, image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 214, name: "Catheter Set", desc: "Silicone foley 2-way", price: 35000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 215, name: "Oxygen Mask", desc: "Adult size with tubing", price: 15000, image: "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=300", badge: "" }
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  React.useEffect(() => {
    if (activeTab !== 'home') setIsCategoryOpen(false);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'cart': return <Cart />;
      case 'categories': return <Categories isPage={true} onToggle={setIsCategoryOpen} />;
      case 'admin': return <Admin />;
      case 'account': return <Account onAdminClick={() => setActiveTab('admin')} />;
      default: return (
        <>
          {!isCategoryOpen && <HeroSlider />}
          <Categories onToggle={setIsCategoryOpen} />
          {!isCategoryOpen && (
            <>
              <ProductGrid title="Essential & Trending" products={trendingProducts} />
              <div className="banner-small">
                <div className="banner-text">
                  <h3>SkieZ Delivery</h3>
                  <p>Express pharmaceutical delivery across Uganda within 24hrs.</p>
                </div>
              </div>
              <ProductGrid title="Surgical & Consumables" products={generalProducts} />
            </>
          )}
        </>
      );
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="main-content">{renderContent()}</main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
