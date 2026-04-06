import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminData, setAdminData] = useState({ products: [], categories: [], subcategories: [], animations: [] });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setIsInitializing(false);
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setSession(session);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (session) {
      const sync = async () => {
        try {
          const { data: p } = await supabase.from('products').select('id, name');
          const { data: c } = await supabase.from('categories').select('id, name');
          const { data: s } = await supabase.from('subcategories').select('id, name');
          const { data: a } = await supabase.from('animations').select('id, title');
          setAdminData({ 
            products: p || [], 
            categories: c || [], 
            subcategories: s || [], 
            animations: a || [] 
          });
        } catch (err) {
          console.error("Admin Sync Error:", err);
        }
      };
      sync();
    }
  }, [session, loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login Error: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isInitializing) return <div className="admin-loader">Synchronizing SkieZ Systems...</div>;

  if (!session) {
    return (
      <div className="admin-wrapper fade-in">
        <form className="admin-login-box" onSubmit={handleLogin}>
          <h2>SKIEZ | ADMIN</h2>
          <p className="admin-subtitle">Master authentication required.</p>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="admin-input" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="admin-input" />
          <button type="submit" disabled={loading} className="admin-btn primary">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  const userEmail = session.user?.email || "Unknown User";
  if (userEmail !== 'israelezrakisakye@gmail.com') {
    return (
      <div className="admin-wrapper fade-in">
        <div className="admin-alert">
          <h2>Unauthorized</h2>
          <p>Logged in as <strong>{userEmail}</strong>.</p>
          <button onClick={handleLogout} className="admin-btn primary outline">Switch Account</button>
        </div>
      </div>
    );
  }

  const pickAndUploadImage = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0]; if (!file) return resolve(null);
        try {
          const fileName = `${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`;
          const { error } = await supabase.storage.from('app_images').upload(fileName, file);
          if (error) { alert("Upload Error: " + error.message); return resolve(null); }
          const { data: { publicUrl } } = supabase.storage.from('app_images').getPublicUrl(fileName);
          resolve(publicUrl);
        } catch (error) { alert('Upload failed.'); resolve(null); }
      };
      input.click();
    });
  };

  // CRUD Functions
  const handleAddProduct = async () => {
    const name = prompt("Name:"); if (!name) return;
    const price = prompt("Price (UGX):", "0");
    const desc = prompt("Description:");
    const imageUrl = await pickAndUploadImage(); if (!imageUrl) return;
    setLoading(true);
    await supabase.from('products').insert([{ name, price, description: desc, image: imageUrl }]);
    setLoading(false);
  };

  const handleEditProduct = async () => {
    const id = prompt("Product ID:"); if (!id) return;
    const { data: prod } = await supabase.from('products').select('*').eq('id', id).single(); if (!prod) return;
    const newName = prompt("New Name:", prod.name) || prod.name;
    const newPrice = prompt("New Price:", prod.price) || prod.price;
    let finalImage = prod.image;
    if (window.confirm("Change image?")) { const url = await pickAndUploadImage(); if (url) finalImage = url; }
    await supabase.from('products').update({ name: newName, price: newPrice, image: finalImage }).eq('id', id);
    setLoading(!loading);
  };

  const handleDeleteProduct = async () => {
    const id = prompt("Product ID to DELETE:"); if (!id || !window.confirm("Delete?")) return;
    await supabase.from('products').delete().eq('id', id);
    setLoading(!loading);
  };

  const handleAddBanner = async () => {
    const title = prompt("Title:"); if (!title) return;
    const sub = prompt("Subtitle:");
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('animations').insert([{ title, subtitle: sub, img: url }]);
    setLoading(!loading);
  };

  const handleEditBanner = async () => {
    const id = prompt("Banner ID:"); if (!id) return;
    const { data: b } = await supabase.from('animations').select('*').eq('id', id).single(); if (!b) return;
    const newTitle = prompt("Title:", b.title) || b.title;
    let finalImg = b.img;
    if (window.confirm("Change image?")) { const url = await pickAndUploadImage(); if (url) finalImg = url; }
    await supabase.from('animations').update({ title: newTitle, img: finalImg }).eq('id', id);
    setLoading(!loading);
  };

  const handleDeleteBanner = async () => {
    const id = prompt("Banner ID to DELETE:"); if (!id || !window.confirm("Delete?")) return;
    await supabase.from('animations').delete().eq('id', id);
    setLoading(!loading);
  };

  const handleAddCategory = async () => {
    const name = prompt("Category Name:"); if (!name) return;
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('categories').insert([{ name, img: url }]);
    setLoading(!loading);
  };

  const handleEditCategory = async () => {
    const id = prompt("Category ID:"); if (!id) return;
    const { data: cat } = await supabase.from('categories').select('*').eq('id', id).single(); if (!cat) return;
    const newName = prompt("Name:", cat.name) || cat.name;
    let finalImg = cat.img;
    if (window.confirm("Change image?")) { const url = await pickAndUploadImage(); if (url) finalImg = url; }
    await supabase.from('categories').update({ name: newName, img: finalImg }).eq('id', id);
    setLoading(!loading);
  };

  const handleDeleteCategory = async () => {
    const id = prompt("Category ID to DELETE:"); if (!id || !window.confirm("Delete?")) return;
    await supabase.from('categories').delete().eq('id', id);
    setLoading(!loading);
  };

  const handleAddSubcategory = async () => {
    const parentId = prompt("Parent Category ID (e.g. 1):"); if (!parentId) return;
    const name = prompt("Class Name:"); if (!name) return;
    const url = await pickAndUploadImage(); if (!url) return;
    await supabase.from('subcategories').insert([{ name, img: url, category_id: parentId }]);
    setLoading(!loading);
  };

  const handleEditSubcategory = async () => {
    const id = prompt("Class ID:"); if (!id) return;
    const { data: sub } = await supabase.from('subcategories').select('*').eq('id', id).single(); if (!sub) return;
    const newName = prompt("Name:", sub.name) || sub.name;
    let finalImg = sub.img;
    if (window.confirm("Change image?")) { const url = await pickAndUploadImage(); if (url) finalImg = url; }
    await supabase.from('subcategories').update({ name: newName, img: finalImg }).eq('id', id);
    setLoading(!loading);
  };

  const handleDeleteSubcategory = async () => {
    const id = prompt("Class ID to DELETE:"); if (!id || !window.confirm("Delete?")) return;
    await supabase.from('subcategories').delete().eq('id', id);
    setLoading(!loading);
  };

  return (
    <div className="admin-dashboard-container fade-in">
      <div className="admin-top-bar">
        <div>
          <h2>Control Center</h2>
          <div className="admin-user-pill">{userEmail}</div>
        </div>
        <button onClick={handleLogout} className="admin-btn text coral">Exit Console</button>
      </div>
      
      <div className="admin-main-grid">
        {/* PRODUCTS SECTION */}
        <div className="admin-control-card">
          <div className="card-top">
            <h3>Products</h3>
            <span className="live-pill">Total: {adminData.products.length}</span>
          </div>
          <div className="id-catalog-compact">
            {adminData.products.length === 0 ? "No inventory sync" : adminData.products.slice(0, 8).map(p => <div key={p.id}>ID: <strong>{p.id}</strong> - {p.name}</div>)}
          </div>
          <div className="card-actions-grid">
            <button onClick={handleAddProduct} className="action-btn-main">Add New</button>
            <button onClick={handleEditProduct} className="action-btn-outline">Edit</button>
            <button onClick={handleDeleteProduct} className="action-btn-danger">Delete</button>
          </div>
        </div>
        
        {/* BANNERS SECTION */}
        <div className="admin-control-card">
          <div className="card-top">
            <h3>Hero Banners</h3>
            <span className="live-pill hot">Slides: {adminData.animations.length}</span>
          </div>
          <div className="id-catalog-compact">
            {adminData.animations.map(a => <div key={a.id}>ID: <strong>{a.id}</strong> - {a.title}</div>)}
          </div>
          <div className="card-actions-grid">
            <button onClick={handleAddBanner} className="action-btn-main">Create Banner</button>
            <button onClick={handleEditBanner} className="action-btn-outline">Update Slide</button>
            <button onClick={handleDeleteBanner} className="action-btn-danger">Remove</button>
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="admin-control-card">
          <div className="card-top">
            <h3>Categories & Classes</h3>
            <span className="live-pill blue">Cats: {adminData.categories.length}</span>
          </div>
          <div className="id-catalog-compact dual">
            <div className="catalog-col">
              <strong>Categories:</strong>
              {adminData.categories.map(c => <div key={c.id}>ID: <strong>{c.id}</strong> - {c.name}</div>)}
            </div>
            <div className="catalog-col">
              <strong>Classes:</strong>
              {adminData.subcategories.slice(0, 5).map(s => <div key={s.id}>ID: <strong>{s.id}</strong> - {s.name}</div>)}
              {adminData.subcategories.length > 5 && <div>...and {adminData.subcategories.length - 5} more</div>}
            </div>
          </div>
          <div className="card-actions-grid">
            <button onClick={handleAddCategory} className="action-btn-main">New Cat</button>
            <button onClick={handleEditCategory} className="action-btn-outline">Edit Cat</button>
            <button onClick={handleDeleteCategory} className="action-btn-danger">Del Cat</button>
          </div>
          <div className="card-actions-grid" style={{marginTop: '8px'}}>
            <button onClick={handleAddSubcategory} className="action-btn-outline">Add Class</button>
            <button onClick={handleEditSubcategory} className="action-btn-outline">Edit Class</button>
            <button onClick={handleDeleteSubcategory} className="action-btn-danger">Del Class</button>
          </div>
        </div>
      </div>
    </div>
  );
}
