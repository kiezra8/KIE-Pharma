import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './HeroSlider.css';

const defaultBanners = [
  { id: 1, title: "Advanced Pharmaceutical Care", subtitle: "Your Trusted Partner in Health", img: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg" },
  { id: 2, title: "Turbo Fast Delivery", subtitle: "Swift pharmaceutical delivery across Uganda within 24 hours.", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200" },
  { id: 3, title: "Quality Lab Equipment", subtitle: "Precision tools for modern medical diagnostic centers.", img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=1200" }
];

import { pickAndUploadImage } from '../utils/imageUtils';

export default function HeroSlider({ isAdmin }) {
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState(defaultBanners);
  const [sync, setSync] = useState(0);

  useEffect(() => {
    supabase.from('animations').select('*').then(({ data }) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, [sync]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleQuickSwap = async (item) => {
     const url = await pickAndUploadImage();
     if (url) {
        await supabase.from('animations').update({ img: url }).eq('id', item.id);
        setSync(s => s + 1);
     }
  };

  return (
    <div className="banners-container">
      <div className="banner-slider">
        {banners.map((item, i) => (
          <div key={item.id} className={`banner ${i === index ? 'active' : ''}`}>
            <img src={item.img} alt={item.title} />
            {isAdmin && (
               <button className="live-edit-overlay" onClick={() => handleQuickSwap(item)}>
                  <div className="live-edit-icon">📸 Change Banner Image</div>
               </button>
            )}
            <div className="banner-overlay suit-up-style">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="banner-dots">
          {banners.map((_, i) => (
            <div 
              key={i} 
              className={`banner-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
