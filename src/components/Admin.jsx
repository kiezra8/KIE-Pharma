import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Camera, Plus, Trash2, Edit2, X, Box, Layout, Sliders, ChevronRight, Check } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Navigation
  const [activeTab, setActiveTab] = useState('products');
  const [adminData, setAdminData] = useState({ products: [], categories: [], subcategories: [], animations: [] });

  // Modal State
  const [showForm, setShowForm] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    const { data: s } = await supabase.from('subcategories').select('*').order('created_at', { ascending: false });
    const { data: a } = await supabase.from('animations').select('*').order('created_at', { ascending: false });
    setAdminData({ products: p || [], categories: c || [], subcategories: s || [], animations: a || [] });
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const pickImage = async (field) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      setLoading(true);
      const name = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('app_images').upload(name, file);
      if (error) { alert(error.message); setLoading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('app_images').getPublicUrl(name);
      setFormData(prev => ({ ...prev, [field]: publicUrl }));
      setLoading(false);
    };
    input.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    let table = activeTab === 'banners' ? 'animations' : (activeTab === 'drug classes' ? 'subcategories' : activeTab);
    try {
      if (targetItem) {
        await supabase.from(table).update(formData).eq('id', targetItem.id);
      } else {
        await supabase.from(table).insert([formData]);
      }
      setShowForm(false);
      fetchData();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    let table = activeTab === 'banners' ? 'animations' : (activeTab === 'drug classes' ? 'subcategories' : activeTab);
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  if (isInitializing) return <div className="admin-status">Connecting to SkieZ Vault...</div>;

  if (!session) {
    return (
      <div className="admin-auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>SKIEZ ADMIN</h2>
          <p>Master Console Unlock</p>
          <input type="email" placeholder="Admin Identity" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Key" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Syncing...' : 'Authenticate'}</button>
        </form>
      </div>
    );
  }

  const isMaster = session.user.email === 'israelezrakisakye@gmail.com';
  if (!isMaster) return <div className="admin-status">Access Denied. Identity mismatch.</div>;

  const currentList = activeTab === 'products' ? adminData.products : (activeTab === 'categories' ? adminData.categories : (activeTab === 'drug classes' ? adminData.subcategories : adminData.animations));

  return (
    <div className="admin-pro-layout">
      {/* Sidebar - Desktop Only / Fixed - Modern */}
      <aside className="admin-nav-rail">
        <div className="nav-brand">SKIEZ</div>
        <div className={`rail-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}><Box /> <span>Products</span></div>
        <div className={`rail-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}><Layout /> <span>Categories</span></div>
        <div className={`rail-item ${activeTab === 'drug classes' ? 'active' : ''}`} onClick={() => setActiveTab('drug classes')}><ChevronRight /> <span>Classes</span></div>
        <div className={`rail-item ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}><Sliders /> <span>Banners</span></div>
        <button className="rail-logout" onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </aside>

      {/* Main Panel */}
      <main className="admin-view-panel">
        <header className="view-header">
          <div>
            <h1>{activeTab.toUpperCase()}</h1>
            <p>Managing {currentList.length} active database records.</p>
          </div>
          <button className="pro-add-btn" onClick={() => { setTargetItem(null); setFormData({}); setShowForm(true); }}>
            <Plus size={20} /> Add New {activeTab.slice(0,-1)}
          </button>
        </header>

        <section className="pro-data-grid">
          {currentList.map(item => (
            <div key={item.id} className="pro-data-card">
              <div className="pro-card-img">
                <img src={item.image || item.img || item.imageurl} alt="p" />
                <button className="img-swap-overlay" onClick={() => { setTargetItem(item); setFormData(item); pickImage(activeTab === 'products' ? 'image' : 'img'); }}>
                  <Camera size={18} />
                </button>
              </div>
              <div className="pro-card-body">
                <h4>{item.name || item.title}</h4>
                <div className="pro-card-meta">
                  {item.price && <span>UGX {item.price.toLocaleString()}</span>}
                  <span>ID: {item.id}</span>
                </div>
                <div className="pro-card-actions">
                  <button onClick={() => { setTargetItem(item); setFormData(item); setShowForm(true); }}><Edit2 size={16} /> Edit Data</button>
                  <button className="del-btn" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Mobile Nav Rail (Footer on Mobile) */}
      <div className="admin-mobile-nav">
          <div className={`m-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}><Box /></div>
          <div className={`m-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}><Layout /></div>
          <div className={`m-nav-item ${activeTab === 'drug classes' ? 'active' : ''}`} onClick={() => setActiveTab('drug classes')}><ChevronRight /></div>
          <div className={`m-nav-item ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}><Sliders /></div>
      </div>

      {/* Modern Data Form Modal */}
      {showForm && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-window">
            <div className="modal-top">
              <h3>{targetItem ? 'Update Database' : 'New Database Entry'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="pro-form">
               <div className="pro-form-img-container" onClick={() => pickImage(activeTab === 'products' ? 'image' : 'img')}>
                  {(formData.image || formData.img) ? <img src={formData.image || formData.img} /> : <div className="img-placeholder"><Camera /> Change Content Image</div>}
               </div>

               <div className="pro-input-group">
                  <label>Label / Title</label>
                  <input value={formData.name || formData.title || ''} onChange={e => setFormData({...formData, [activeTab === 'banners' ? 'title' : 'name']: e.target.value})} />
               </div>

               {activeTab === 'products' && (
                 <div className="form-split">
                    <div className="pro-input-group"><label>Price (UGX)</label><input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                    <div className="pro-input-group"><label>Class ID</label><input type="number" value={formData.subcategory_id || ''} onChange={e => setFormData({...formData, subcategory_id: Number(e.target.value)})} /></div>
                 </div>
               )}

               {activeTab === 'drug classes' && (
                 <div className="pro-input-group"><label>Category Parent ID (Drugs=1)</label><input type="number" value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: Number(e.target.value)})} /></div>
               )}

               <button type="submit" className="pro-save-btn" disabled={loading}>
                 {loading ? 'Processing...' : <><Check size={20} /> Update SkieZ Core</>}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
