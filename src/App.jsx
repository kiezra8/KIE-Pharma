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
  { id: 103, name: "Pulse Oximeter Pro", desc: "SPO2 & Heart Rate Monitoring", price: 85000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "New" },
  { id: 104, name: "Surgical Face Masks (50pcs)", desc: "Blue 3-ply high filtration", price: 15000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "Essential" },
  { id: 105, name: "Sterile Syringes (2ml)", desc: "Luer slip with needle", price: 35000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "Essential" },
  { id: 106, name: "Infrared Thermometer", desc: "Non-contact medical grade", price: 125000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "Hot" },
  { id: 107, name: "Blood Pressure Monitor", desc: "Upper arm automatic type", price: 185000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "Trending" },
  { id: 108, name: "Glucometer Accu-Check", desc: "Instant glucose monitoring", price: 145000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "Essential" },
  { id: 109, name: "Adhesive Bandages", desc: "Breathable fabric strips", price: 5000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "New" },
  { id: 110, name: "Medical Alcohol 70%", desc: "1 Liter disinfecting spirit", price: 18000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "Essential" },
  { id: 111, name: "Gauze Rolls 5cm", desc: "High absorption cotton gauze", price: 25000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "New" },
  { id: 112, name: "First Aid Kit Pro", desc: "Comprehensive home medical set", price: 95000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "Trending" },
  { id: 113, name: "N95 Dust Masks", desc: "Packet of 10 high-spec filters", price: 45000, image: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg", badge: "Hot" },
  { id: 114, name: "Nebulizer Machine", desc: "Compressor medical inhaler", price: 215000, image: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg", badge: "New" },
  { id: 115, name: "Oxygen Concentrator", desc: "Portable 5L medical supply", price: 2850000, image: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg", badge: "Essential" }
];

const defaultGeneral = [
  ...defaultTrending,
  { id: 201, name: "Centrifuge Machine Lab", desc: "High-speed laboratory usage", price: 4500000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300", badge: "" },
  { id: 202, name: "Hospital Bed V3", desc: "Mechanical adjustable ward bed", price: 1850000, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300", badge: "" }
];

function AppContent() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [allProductsRaw, setAllProductsRaw] = useState(defaultGeneral);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);

  const isAdmin = session?.user?.email === 'israelezrakisakye@gmail.com';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const trendingProducts = allProductsRaw.filter(p => 
    (['Hot', 'Trending', 'New'].includes(p.badge)) && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 15);

  const generalProducts = allProductsRaw.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    async function initCatalog() {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data && data.length > 0) setAllProductsRaw(data);
      } catch (err) {
        console.error("Catalog Init Error:", err);
      } finally {
        setTimeout(() => setIsAppLoading(false), 1500);
      }
    }
    initCatalog();
  }, []);

  React.useEffect(() => {
    if (activeTab !== 'home') setIsCategoryOpen(false);
  }, [activeTab]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, isCategoryOpen]);

  if (isAppLoading) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-icon-wrapper">
             <img src="https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg" alt="SkieZ" />
          </div>
          <h1>SKIEZ PHARMA</h1>
          <p>UGANDA'S TRUSTED PARTNER</p>
          <div className="splash-progress">
             <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'cart': return <Cart />;
      case 'categories': return <Categories isPage={true} onToggle={setIsCategoryOpen} isAdmin={isAdmin} />;
      case 'admin': return <Admin />;
      case 'account': return <Account onAdminClick={() => setActiveTab('admin')} />;
      default: return (
        <>
          {!isCategoryOpen && <HeroSlider isAdmin={isAdmin} />}
          <Categories onToggle={setIsCategoryOpen} isAdmin={isAdmin} />
          {!isCategoryOpen && (
            <>
              <ProductGrid title="Essential & Trending" products={trendingProducts} isAdmin={isAdmin} />
              <ProductGrid title="All Products" products={generalProducts} isAdmin={isAdmin} />
            </>
          )}
        </>
      );
    }
  };

  return (
    <div className="container">
      <Header onSearch={setSearchQuery} />
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
