import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Camera, Plus, Trash2, Edit2, X, Image as ImageIcon, Box, Layout, Sliders, ChevronRight } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminData, setAdminData] = useState({ products: [], categories: [], subcategories: [], animations: [] });
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'product', 'category', 'class', 'banner'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) { setSession(session); setIsInitializing(false); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setSession(session);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const syncData = async () => {
    const { data: p } = await supabase.from('products').select('*');
    const { data: c } = await supabase.from('categories').select('*');
    const { data: s } = await supabase.from('subcategories').select('*');
    const { data: a } = await supabase.from('animations').select('*');
    setAdminData({ products: p || [], categories: c || [], subcategories: s || [], animations: a || [] });
  };

  useEffect(() => { if (session) syncData(); }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login Error: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

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

  const openForm = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    let table = modalType === 'banner' ? 'animations' : (modalType === 'class' ? 'subcategories' : (modalType === 'product' ? 'products' : 'categories'));
    
    try {
      if (editingItem) {
        await supabase.from(table).update(formData).eq('id', editingItem.id);
      } else {
        await supabase.from(table).insert([formData]);
      }
      setShowModal(false);
      syncData();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    setLoading(true);
    await supabase.from(table).delete().eq('id', id);
    syncData();
    setLoading(false);
  };

  if (isInitializing) return <div className="admin-loader">Secure System Initializing...</div>;

  if (!session) {
    return (
      <div className="admin-wrapper fade-in">
        <form className="admin-login-box" onSubmit={handleLogin}>
          <h2>SKIEZ | ADMIN</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="admin-input" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="admin-input" />
          <button type="submit" disabled={loading} className="admin-btn primary">{loading ? 'Verifying...' : 'Sign In'}</button>
        </form>
      </div>
    );
  }

  const userEmail = session.user?.email;
  if (userEmail !== 'israelezrakisakye@gmail.com') {
    return (
      <div className="admin-wrapper fade-in">
        <div className="admin-alert">
          <h2>Unauthorized Access</h2>
          <p>This area is restricted to the master administrator account.</p>
          <button onClick={handleLogout} className="admin-btn primary outline">Switch Account</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container fade-in">
      <div className="admin-top-bar primary-style">
        <div>
          <h2>CONTROL HUB</h2>
          <div className="admin-user-pill">Admin Mode Active</div>
        </div>
        <button onClick={handleLogout} className="admin-btn text coral">Sign Out</button>
      </div>
      
      <div className="admin-main-grid">
        {/* PRODUCTS CARD */}
        <div className="admin-control-card premium">
          <div className="card-top">
            <div className="card-icon-title"><Box size={20} className="icon-pink" /> <h3>Products</h3></div>
            <button className="add-icon-btn" onClick={() => openForm('product')}><Plus size={20}/></button>
          </div>
          <div className="id-catalog-list">
            {adminData.products.map(p => (
              <div key={p.id} className="catalog-item-row">
                <div className="item-thumbnail"><img src={p.image} alt="p" /></div>
                <div className="item-txt"><h4>{p.name}</h4><span>ID: {p.id} • UGX {p.price?.toLocaleString()}</span></div>
                <div className="row-actions">
                  <button onClick={() => openForm('product', p)}><Edit2 size={14}/></button>
                  <button className="del" onClick={() => handleDelete('products', p.id)}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* BANNERS CARD */}
        <div className="admin-control-card premium">
          <div className="card-top">
            <div className="card-icon-title"><Sliders size={20} className="icon-orange" /> <h3>Animations</h3></div>
            <button className="add-icon-btn" onClick={() => openForm('banner')}><Plus size={20}/></button>
          </div>
          <div className="id-catalog-list">
            {adminData.animations.map(a => (
              <div key={a.id} className="catalog-item-row">
                <div className="item-thumbnail"><img src={a.img} alt="a" /></div>
                <div className="item-txt"><h4>{a.title}</h4><span>ID: {a.id}</span></div>
                <div className="row-actions">
                  <button onClick={() => openForm('banner', a)}><Edit2 size={14}/></button>
                  <button className="del" onClick={() => handleDelete('animations', a.id)}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES CARD */}
        <div className="admin-control-card premium">
          <div className="card-top">
            <div className="card-icon-title"><Layout size={20} className="icon-blue" /> <h3>Categories</h3></div>
            <button className="add-icon-btn" onClick={() => openForm('category')}><Plus size={20}/></button>
          </div>
          <div className="id-catalog-list">
            {adminData.categories.map(c => (
              <div key={c.id} className="catalog-item-row">
                <div className="item-thumbnail"><img src={c.img || c.image} alt="c" /></div>
                <div className="item-txt"><h4>{c.name}</h4><span>ID: {c.id}</span></div>
                <div className="row-actions">
                  <button onClick={() => openForm('category', c)}><Edit2 size={14}/></button>
                  <button className="del" onClick={() => handleDelete('categories', c.id)}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CLASSES CARD (DRUGS ONLY) */}
        <div className="admin-control-card premium">
          <div className="card-top">
            <div className="card-icon-title"><ChevronRight size={20} className="icon-green" /> <h3>Drug Classes</h3></div>
            <button className="add-icon-btn" onClick={() => openForm('class')}><Plus size={20}/></button>
          </div>
          <div className="id-catalog-list">
            {adminData.subcategories.map(s => (
              <div key={s.id} className="catalog-item-row">
                <div className="item-thumbnail"><img src={s.img || s.image} alt="s" /></div>
                <div className="item-txt"><h4>{s.name}</h4><span>ID: {s.id} • Parent ID: {s.category_id}</span></div>
                <div className="row-actions">
                  <button onClick={() => openForm('class', s)}><Edit2 size={14}/></button>
                  <button className="del" onClick={() => handleDelete('subcategories', s.id)}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GLOBAL FORM MODAL */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box fade-in">
            <div className="modal-head">
              <h3>{editingItem ? 'Edit Entry' : 'Create New'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="admin-item-form">
              <div className="form-img-picker" onClick={async() => {
                 const url = await pickAndUploadImage();
                 if (url) setFormData({...formData, [modalType === 'banner' ? 'img' : (modalType === 'product' ? 'image' : 'img')]: url});
              }}>
                {(formData.image || formData.img) ? (
                  <img src={formData.image || formData.img} alt="prev" />
                ) : (
                  <div className="picker-placeholder"><Camera size={24}/> <span>Upload Image</span></div>
                )}
                <div className="picker-overlay"><Plus size={20}/></div>
              </div>
              
              <div className="form-group">
                <label>Title / Name</label>
                <input name="title" value={formData.name || formData.title || ''} onChange={e => setFormData({...formData, [modalType === 'banner' ? 'title' : 'name']: e.target.value})} required />
              </div>

              {modalType === 'product' && (
                <div className="form-row">
                  <div className="form-group"><label>Price (UGX)</label><input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                  <div className="form-group"><label>Class ID</label><input type="number" value={formData.subcategory_id || ''} onChange={e => setFormData({...formData, subcategory_id: e.target.value})} /></div>
                </div>
              )}

              {modalType === 'class' && (
                <div className="form-group"><label>Parent Category ID (Drugs=1)</label><input type="number" value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})} /></div>
              )}

              <button type="submit" disabled={loading} className="save-btn">{loading ? 'Syncing...' : (editingItem ? 'Update Database' : 'Finalize Entry')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
