import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Camera, Plus, Trash2, Edit2, X, Box, Info } from 'lucide-react';
import { pickAndUploadImage } from '../utils/imageUtils';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminData, setAdminData] = useState({ products: [], categories: [], subcategories: [], animations: [] });

  const sync = async () => {
    const { data: p } = await supabase.from('products').select('*').order('id', { ascending: false });
    const { data: c } = await supabase.from('categories').select('*').order('id', { ascending: true });
    const { data: s } = await supabase.from('subcategories').select('*').order('id', { ascending: true });
    const { data: a } = await supabase.from('animations').select('*').order('id', { ascending: true });
    setAdminData({ products: p || [], categories: c || [], subcategories: s || [], animations: a || [] });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setIsInitializing(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    if (session) sync();
    return () => subscription.unsubscribe();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleQuickSwap = async (item, table) => {
    const url = await pickAndUploadImage();
    if (url) {
       await supabase.from(table).update(table === 'products' ? { image: url } : { img: url }).eq('id', item.id);
       sync();
    }
  };

  const handleCreate = async (table) => {
    const name = prompt("Enter Name/Title:"); if (!name) return;
    const url = await pickAndUploadImage(); if (!url) return;
    setLoading(true);
    await supabase.from(table).insert([{ [table === 'animations' ? 'title' : 'name']: name, [table === 'animations' ? 'img' : (table === 'products' ? 'image' : 'img')]: url }]);
    sync(); setLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Permanently delete?")) {
        await supabase.from(table).delete().eq('id', id);
        sync();
    }
  };

  if (isInitializing) return <div className="admin-status">System Initializing...</div>;

  if (!session) {
    return (
      <div className="admin-auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>SKIEZ ADMIN</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>Sign In</button>
        </form>
      </div>
    );
  }

  const isMaster = session.user.email === 'israelezrakisakye@gmail.com';
  if (!isMaster) return <div className="admin-status">Unauthorized Access.</div>;

  return (
    <div className="admin-dashboard-pro fade-in">
      <div className="admin-header-row">
        <div><h1>RECORDS HUB</h1><p>Logged in as {session.user.email}</p></div>
        <button onClick={() => supabase.auth.signOut()} className="admin-btn-text">Sign Out</button>
      </div>

      <div className="admin-grid-pro">
        
        {/* PRODUCTS */}
        <div className="admin-card-pro">
          <div className="card-pro-head">
            <div className="card-pro-title"><Box size={18} /> <h3>Products Catalog</h3></div>
            <button className="add-mini-btn" onClick={() => handleCreate('products')}><Plus size={16}/></button>
          </div>
          <div className="card-pro-list">
            {adminData.products.slice(0, 15).map(p => (
              <div key={p.id} className="card-pro-row">
                <div className="row-thumb" onClick={() => handleQuickSwap(p, 'products')}>
                   <img src={p.image} alt="p" /><div className="thumb-edit"><Camera size={14}/></div>
                </div>
                <div className="row-info"><h4>{p.name}</h4><span>ID: {p.id} • UGX {p.price?.toLocaleString()}</span></div>
                <button className="row-del" onClick={() => handleDelete('products', p.id)}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="admin-card-pro">
          <div className="card-pro-head">
             <div className="card-pro-title"><Box size={18} /> <h3>Store Categories</h3></div>
             <button className="add-mini-btn" onClick={() => handleCreate('categories')}><Plus size={16}/></button>
          </div>
          <div className="card-pro-list">
            {adminData.categories.map(c => (
              <div key={c.id} className="card-pro-row">
                <div className="row-thumb" onClick={() => handleQuickSwap(c, 'categories')}>
                   <img src={c.img || c.image} alt="c" /><div className="thumb-edit"><Camera size={14}/></div>
                </div>
                <div className="row-info"><h4>{c.name}</h4><span>ID: {c.id}</span></div>
                <button className="row-del" onClick={() => handleDelete('categories', c.id)}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* DRUG CLASSES */}
        <div className="admin-card-pro">
          <div className="card-pro-head">
             <div className="card-pro-title"><Info size={18} /> <h3>Drug Classification</h3></div>
             <button className="add-mini-btn" onClick={() => handleCreate('subcategories')}><Plus size={16}/></button>
          </div>
          <div className="card-pro-list">
            {adminData.subcategories.map(s => (
              <div key={s.id} className="card-pro-row">
                <div className="row-thumb" onClick={() => handleQuickSwap(s, 'subcategories')}>
                   <img src={s.img || s.image} alt="s" /><div className="thumb-edit"><Camera size={14}/></div>
                </div>
                <div className="row-info"><h4>{s.name}</h4><span>ID: {s.id} • Parent: {s.category_id}</span></div>
                <button className="row-del" onClick={() => handleDelete('subcategories', s.id)}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* SLIDER */}
        <div className="admin-card-pro">
          <div className="card-pro-head">
             <div className="card-pro-title"><Plus size={18} /> <h3>Hero Banners</h3></div>
             <button className="add-mini-btn" onClick={() => handleCreate('animations')}><Plus size={16}/></button>
          </div>
          <div className="card-pro-list">
            {adminData.animations.map(a => (
              <div key={a.id} className="card-pro-row">
                <div className="row-thumb" onClick={() => handleQuickSwap(a, 'animations')}>
                   <img src={a.img} alt="a" /><div className="thumb-edit"><Camera size={14}/></div>
                </div>
                <div className="row-info"><h4>{a.title}</h4><span>ID: {a.id}</span></div>
                <button className="row-del" onClick={() => handleDelete('animations', a.id)}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
