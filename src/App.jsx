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
import { supabase } from './supabaseClient';

const defaultTrending = [
  { id: 101, name: "Premium Nitrile Gloves", desc: "AQL 1.5, Powder-Free, Blue", price: 45000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "Hot" },
  { id: 102, name: "Digital Stethoscope V2", desc: "Ultra-precise acoustic amplification", price: 850000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "Trending" },
  { id: 103, name: "Pulse Oximeter Pro", desc: "SPO2 & Heart Rate Monitoring", price: 85000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "New" }
];

const defaultGeneral = [
  { id: 201, name: "Blood Pressure Monitor Pro", desc: "Automatic upper arm cuff", price: 120000, image: "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=300", badge: "New" },
  { id: 202, name: "Medical Face Masks", desc: "Box of 50, 3-ply", price: 15000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300", badge: "" }
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState(defaultTrending);
  const [generalProducts, setGeneralProducts] = useState(defaultGeneral);

  React.useEffect(() => {
    supabase.from('products').select('*').then(({ data, error }) => {
      if (data && data.length > 0) {
         setTrendingProducts(data.filter(p => ['Hot', 'Trending', 'New'].includes(p.badge)));
         setGeneralProducts(data);
      }
    });
  }, []);

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
              <ProductGrid title="All Products" products={generalProducts} />
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
