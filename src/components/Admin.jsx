import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Layout, Box, Sliders, LogOut, ChevronRight, Upload } from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Dashboard State
  const [activeView, setActiveView] = useState('products');
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && activeView) fetchData();
  }, [session, activeView]);

  const fetchData = async () => {
    setLoading(true);
    let table = activeView === 'banners' ? 'animations' : activeView;
    const { data: result } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    setData(result || []);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login Error: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  const pickAndUploadImage = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return resolve(null);
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const { error } = await supabase.storage.from('app_images').upload(fileName, file);
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from('app_images').getPublicUrl(fileName);
          resolve(publicUrl);
        } catch (err) {
          alert("Upload failed: " + err.message);
          resolve(null);
        }
      };
      input.click();
    });
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    let table = activeView === 'banners' ? 'animations' : activeView;
    let payload = { ...formData };
    
    // Ensure correct image field mapping
    if (activeView === 'banners' && payload.image) {
      payload.img = payload.image;
      delete payload.image;
    }

    try {
      if (editingItem) {
        await supabase.from(table).update(payload).eq('id', editingItem.id);
      } else {
        await supabase.from(table).insert([payload]);
      }
      setShowModal(false);
      fetchData();
      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item? This action is permanent!")) return;
    let table = activeView === 'banners' ? 'animations' : activeView;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  if (isInitializing) return <div className="admin-loading-screen">Authenticating Master Admin...</div>;

  if (!session) {
    return (
      <div className="admin-auth-container">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <div className="admin-logo-circle"><Box color="#fff"/></div>
            <h2>Admin Console</h2>
            <p>Enter credentials for KIE Pharma Control</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Key Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Access Dashboard'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-head">
          <div className="sidebar-logo">SKIEZ</div>
          <span className="sidebar-version">v2.0 PRO</span>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-link ${activeView === 'products' ? 'active' : ''}`} onClick={() => setActiveView('products')}>
            <Box size={20} /> Products
          </div>
          <div className={`nav-link ${activeView === 'categories' ? 'active' : ''}`} onClick={() => setActiveView('categories')}>
            <Layout size={20} /> Categories
          </div>
          <div className={`nav-link ${activeView === 'subcategories' ? 'active' : ''}`} onClick={() => setActiveView('subcategories')}>
            <ChevronRight size={20} /> Drug Classes
          </div>
          <div className={`nav-link ${activeView === 'banners' ? 'active' : ''}`} onClick={() => setActiveView('banners')}>
            <Sliders size={20} /> Hero Banners
          </div>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout">
          <LogOut size={18} /> Exit Console
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="main-header">
          <div className="header-info">
            <h1>{activeView === 'subcategories' ? 'DRUG CLASSES' : activeView.toUpperCase()}</h1>
            <p>Manage your medical supply {activeView} database.</p>
          </div>
          <button className="add-new-btn" onClick={() => openForm()}>
            <Plus size={20} /> Add New
          </button>
        </header>

        <section className="data-grid">
          {loading ? (
            <div className="grid-loader">Synchronizing with Supabase...</div>
          ) : (
            data.map(item => (
              <div key={item.id} className="admin-item-card">
                <div className="item-preview">
                  <img src={item.image || item.img || item.imageurl} alt={item.name} />
                </div>
                <div className="item-info">
                  <h4>{item.name || item.title}</h4>
                  <p>{item.price ? `UGX ${item.price.toLocaleString()}` : (item.subtitle || `ID: ${item.id}`)}</p>
                </div>
                <div className="item-actions">
                  <button className="action-btn edit" onClick={() => openForm(item)}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Entry' : 'New Entry'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-image-preview" onClick={async () => {
                const url = await pickAndUploadImage();
                if (url) setFormData({...formData, [activeView === 'banners' ? 'img' : (activeView === 'products' ? 'image' : 'img')]: url});
              }}>
                {(formData.image || formData.img || formData.imageurl) ? (
                  <img src={formData.image || formData.img || formData.imageurl} alt="preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <span>Upload Image from Gallery</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>{activeView === 'banners' ? 'Banner Title' : 'Name / Label'}</label>
                <input 
                  type="text" 
                  value={formData.name || formData.title || ''} 
                  onChange={e => setFormData({...formData, [activeView === 'banners' ? 'title' : 'name']: e.target.value})}
                  required 
                />
              </div>

              {activeView === 'products' && (
                <div className="form-group">
                  <label>Price (UGX)</label>
                  <input 
                    type="number" 
                    value={formData.price || ''} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required 
                  />
                </div>
              )}

              {activeView === 'subcategories' && !editingItem && (
                <div className="form-group">
                  <label>Parent Category ID</label>
                  <input 
                    type="number" 
                    value={formData.category_id || ''} 
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                    required 
                  />
                </div>
              )}

              <div className="form-group">
                <label>{activeView === 'banners' ? 'Subtitle' : 'Badge / Details'}</label>
                <input 
                  type="text" 
                  value={formData.badge || formData.subtitle || ''} 
                  onChange={e => setFormData({...formData, [activeView === 'banners' ? 'subtitle' : 'badge']: e.target.value})}
                />
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Processing...' : (editingItem ? 'Commit Changes' : 'Create Entry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
