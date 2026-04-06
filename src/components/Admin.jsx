import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login Error: " + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isInitializing) return <div style={{padding: '50px', textAlign: 'center'}}>Loading configuration...</div>;

  if (!session) {
    return (
      <div className="admin-wrapper fade-in">
        <form className="admin-login-box" onSubmit={handleLogin}>
          <h2>Supabase Admin</h2>
          <p className="admin-subtitle">Secure portal to manage SkieZ settings.</p>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="admin-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="admin-input"
          />
          <button type="submit" disabled={loading} className="admin-btn primary">
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    );
  }

  const userEmail = session.user.email;
  if (userEmail !== 'israelezrakisakye@gmail.com') {
    return (
      <div className="admin-wrapper fade-in">
        <div className="admin-alert">
          <h2>Access Denied</h2>
          <p>You are logged in as <strong>{userEmail}</strong>, which is not the authorized master admin account.</p>
          <button onClick={handleLogout} className="admin-btn primary outline">Sign Out</button>
        </div>
      </div>
    );
  }

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
          const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;
          alert("Uploading image to storage... Please wait.");
          const { error } = await supabase.storage.from('app_images').upload(filePath, file);
          if (error) {
            alert("Upload Error: " + error.message);
            return resolve(null);
          }
          const { data: { publicUrl } } = supabase.storage.from('app_images').getPublicUrl(filePath);
          resolve(publicUrl);
        } catch (error) {
          alert('Upload failed.');
          resolve(null);
        }
      };
      input.click();
    });
  };

  const handleEditProduct = async () => {
    const id = prompt("Enter Product ID to edit:");
    if (!id) return;
    const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
    if (!prod) return alert("Product not found");
    const newName = prompt("New Name:", prod.name) || prod.name;
    const newPrice = prompt("New Price:", prod.price) || prod.price;
    const wantsNewImage = window.confirm("Do you want to change image from gallery?");
    let finalImage = prod.image;
    if (wantsNewImage) {
      const uploadedUrl = await pickAndUploadImage();
      if (uploadedUrl) finalImage = uploadedUrl;
    }
    await supabase.from('products').update({ name: newName, price: newPrice, image: finalImage }).eq('id', id);
    alert("Product Updated!");
  };

  const handleAddProduct = async () => {
    const name = prompt("Enter Product Name:");
    if (!name) return;
    const price = prompt("Enter Price (UGX):", "0");
    const desc = prompt("Enter Description:", "Product description here...");
    const badge = prompt("Badge (Hot, New, Essential, or leave blank):", "");
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required to add a product.");
    setLoading(true);
    const { error } = await supabase.from('products').insert([{ name, price, description: desc, badge, image: imageUrl }]);
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Product Added Successfully!");
  };

  const handleEditBanner = async () => {
    const id = prompt("Enter Animation/Banner ID to edit:");
    if (!id) return;
    const { data: b } = await supabase.from('animations').select('*').eq('id', id).single();
    if (!b) return alert("Animation not found");
    const newTitle = prompt("New Title:", b.title) || b.title;
    const wantsNewImage = window.confirm("Do you want to change images from gallery?");
    let finalImage = b.img;
    if (wantsNewImage) {
        const uploadedUrl = await pickAndUploadImage();
        if (uploadedUrl) finalImage = uploadedUrl;
    }
    await supabase.from('animations').update({ title: newTitle, img: finalImage }).eq('id', id);
    alert("Animation Updated!");
  };

  const handleAddBanner = async () => {
    const title = prompt("Enter Banner Title:");
    if (!title) return;
    const subtitle = prompt("Enter Subtitle:");
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required for a new banner.");
    setLoading(true);
    const { error } = await supabase.from('animations').insert([{ title, subtitle, img: imageUrl }]);
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Banner Created!");
  };

  const handleEditCategory = async () => {
    const id = prompt("Enter Category ID to edit:");
    if (!id) return;
    const { data: cat } = await supabase.from('categories').select('*').eq('id', id).single();
    if (!cat) return alert("Category not found");
    const newName = prompt("New Name:", cat.name) || cat.name;
    const wantsNewImage = window.confirm("Do you want to change images from gallery?");
    let finalImage = cat.img;
    if (wantsNewImage) {
        const uploadedUrl = await pickAndUploadImage();
        if (uploadedUrl) finalImage = uploadedUrl;
    }
    await supabase.from('categories').update({ name: newName, img: finalImage }).eq('id', id);
    alert("Category Updated!");
  };

  const handleAddCategory = async () => {
    const name = prompt("Enter Category Name:");
    if (!name) return;
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required for a category.");
    setLoading(true);
    const { error } = await supabase.from('categories').insert([{ name, img: imageUrl }]);
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Category Added!");
  };

  const handleAddSubcategory = async () => {
    const parentId = prompt("Enter Parent Category ID:");
    if (!parentId) return;
    const name = prompt("Enter Class/Subcategory Name:");
    if (!name) return;
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required.");
    setLoading(true);
    const { error } = await supabase.from('subcategories').insert([{ name, img: imageUrl, category_id: parentId }]);
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Drug Class Created!");
  };

  const handleEditSubcategory = async () => {
    const id = prompt("Enter Class/Subcategory ID to edit:");
    if (!id) return;
    const { data: sub } = await supabase.from('subcategories').select('*').eq('id', id).single();
    if (!sub) return alert("Subcategory not found");
    const newName = prompt("New Name:", sub.name) || sub.name;
    const wantsNewImage = window.confirm("Do you want to change images from gallery?");
    let finalImg = sub.img;
    if (wantsNewImage) {
        const uploadedUrl = await pickAndUploadImage();
        if (uploadedUrl) finalImg = uploadedUrl;
    }
    await supabase.from('subcategories').update({ name: newName, img: finalImg }).eq('id', id);
    alert("Drug Class Updated!");
  };

  const handleDeleteProduct = async () => {
    const id = prompt("Enter Product ID to delete:");
    if (!id || !window.confirm("Permanently delete this product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else alert("Product Deleted!");
  };

  const handleDeleteBanner = async () => {
    const id = prompt("Enter Banner ID to delete:");
    if (!id || !window.confirm("Delete this banner/animation?")) return;
    const { error } = await supabase.from('animations').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else alert("Banner Deleted!");
  };

  const handleDeleteCategory = async () => {
    const id = prompt("Enter Category ID to delete:");
    if (!id || !window.confirm("Delete this category?")) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else alert("Category Deleted!");
  };

  const handleDeleteSubcategory = async () => {
    const id = prompt("Enter Class ID to delete:");
    if (!id || !window.confirm("Delete this drug class?")) return;
    const { error } = await supabase.from('subcategories').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else alert("Drug Class Deleted!");
  };

  const [adminData, setAdminData] = useState({ products: [], categories: [], subcategories: [], animations: [] });

  useEffect(() => {
    if (session) {
      const sync = async () => {
        const { data: p } = await supabase.from('products').select('id, name');
        const { data: c } = await supabase.from('categories').select('id, name');
        const { data: s } = await supabase.from('subcategories').select('id, name');
        const { data: a } = await supabase.from('animations').select('id, title');
        setAdminData({ products: p || [], categories: c || [], subcategories: s || [], animations: a || [] });
      };
      sync();
    }
  }, [session, loading]);

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-header">
        <div>
          <h2>SkieZ Control Center</h2>
          <p className="admin-badge">Admin Status Verified: {userEmail}</p>
        </div>
        <button onClick={handleLogout} className="admin-btn text">Log Out</button>
      </div>
      
      <div className="admin-grid">
        {/* PRODUCTS SECTION */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Products</h3>
            <span className="count-dot">Total: {adminData.products.length}</span>
          </div>
          <div style={{maxHeight: '120px', overflowY: 'auto', fontSize: '11px', background: '#f9f9f9', padding: '10px', borderRadius: '10px', marginBottom: '15px'}}>
            {adminData.products.slice(0, 10).map(p => <div key={p.id}>ID: <strong>{p.id}</strong> - {p.name}</div>)}
            {adminData.products.length > 10 && <div>+ {adminData.products.length - 10} more...</div>}
          </div>
          <div className="admin-actions-row">
            <button onClick={handleAddProduct} className="admin-btn primary">Add New</button>
            <button onClick={handleEditProduct} className="admin-btn primary outline">Edit</button>
            <button onClick={handleDeleteProduct} className="admin-btn primary text" style={{color: '#ff4d4d'}}>Delete</button>
          </div>
        </div>
        
        {/* BANNERS SECTION */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Hero Banners</h3>
            <span className="count-dot yellow">Slides: {adminData.animations.length}</span>
          </div>
          <div style={{maxHeight: '120px', overflowY: 'auto', fontSize: '11px', background: '#f9f9f9', padding: '10px', borderRadius: '10px', marginBottom: '15px'}}>
            {adminData.animations.map(a => <div key={a.id}>ID: <strong>{a.id}</strong> - {a.title}</div>)}
          </div>
          <div className="admin-actions-row">
            <button onClick={handleAddBanner} className="admin-btn primary">Create Banner</button>
            <button onClick={handleEditBanner} className="admin-btn primary outline">Edit</button>
            <button onClick={handleDeleteBanner} className="admin-btn primary text" style={{color: '#ff4d4d'}}>Del</button>
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Categories & Classes</h3>
            <span className="count-dot blue">Total Cats: {adminData.categories.length}</span>
          </div>
          <div style={{maxHeight: '120px', overflowY: 'auto', fontSize: '11px', background: '#f9f9f9', padding: '10px', borderRadius: '10px', marginBottom: '15px'}}>
            <strong>Categories (IDs):</strong>
            {adminData.categories.map(c => <div key={c.id}>ID: <strong>{c.id}</strong> - {c.name}</div>)}
            <hr style={{margin: '8px 0', border: '0', borderTop: '1px solid #ddd'}} />
            <strong>Drug Classes (IDs):</strong>
            {adminData.subcategories.map(s => <div key={s.id}>ID: <strong>{s.id}</strong> - {s.name}</div>)}
          </div>
          <div className="admin-actions-row">
            <button onClick={handleAddCategory} className="admin-btn primary">New Cat</button>
            <button onClick={handleEditCategory} className="admin-btn primary outline">Edit Cat</button>
            <button onClick={handleDeleteCategory} className="admin-btn primary text" style={{color: '#ff4d4d'}}>Del</button>
          </div>
          <div className="admin-actions-row" style={{marginTop: '10px'}}>
            <button onClick={handleAddSubcategory} className="admin-btn primary outline">Add Class</button>
            <button onClick={handleEditSubcategory} className="admin-btn primary outline">Edit Class</button>
            <button onClick={handleDeleteSubcategory} className="admin-btn primary text" style={{color: '#ff4d4d'}}>Del Class</button>
          </div>
        </div>
      </div>
    </div>
  );
}

