import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const banners = [
  {
    id: 1,
    title: "Advanced Pharmaceutical Care",
    subtitle: "Your Trusted Partner in Health",
    img: "https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg",
  },
  {
    id: 2,
    title: "Essential Medical Consumables",
    subtitle: "Quality Gloves & Kits for Every Facility",
    img: "https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg",
  },
  {
    id: 3,
    title: "Clinical Lab & Diagnostics",
    subtitle: "Equip Your Facility with Modern Lab Equipment",
    img: "https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg",
  },
  {
    id: 4,
    title: "Premium Nursing Equipment",
    subtitle: "Excellence Driven Healthcare Solutions",
    img: "https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg",
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banners-container">
      <div className="banner-slider">
        {banners.map((item, i) => (
          <div key={item.id} className={`banner ${i === index ? 'active' : ''}`}>
            <img src={item.img} alt={item.title} />
            <div className="banner-overlay">
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
