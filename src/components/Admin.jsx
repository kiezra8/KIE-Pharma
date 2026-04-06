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
  // Strict check on front-end (supabse RLS handles the backend)
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
      // Do not use the 'capture' attribute, so that the mobile device prioritizes the gallery picker over the camera
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
            alert("Upload Error: Check if 'app_images' bucket exists and is public. Error: " + error.message);
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
    
    const newName = prompt("New Name (leave blank to keep current):", prod.name) || prod.name;
    const newPrice = prompt("New Price:", prod.price) || prod.price;
    
    const wantsNewImage = window.confirm("Do you want to change the product image from your device gallery?");
    let finalImage = prod.image;
    if (wantsNewImage) {
      const uploadedUrl = await pickAndUploadImage();
      if (uploadedUrl) finalImage = uploadedUrl;
    }
    
    await supabase.from('products').update({ name: newName, price: newPrice, image: finalImage }).eq('id', id);
    alert("Product Updated!");
  };

  const handleEditBanner = async () => {
    const id = prompt("Enter Animation/Banner ID to edit:");
    if (!id) return;
    const { data: b } = await supabase.from('animations').select('*').eq('id', id).single();
    if (!b) return alert("Animation not found");
    
    const newTitle = prompt("New Title (leave blank to keep current):", b.title) || b.title;
    
    const wantsNewImage = window.confirm("Do you want to change the animation image from your device gallery?");
    let finalImage = b.img;
    if (wantsNewImage) {
      const uploadedUrl = await pickAndUploadImage();
      if (uploadedUrl) finalImage = uploadedUrl;
    }
    
    await supabase.from('animations').update({ title: newTitle, img: finalImage }).eq('id', id);
    alert("Animation Updated!");
  };

  const handleEditCategory = async () => {
    const id = prompt("Enter Category ID to edit:");
    if (!id) return;
    const { data: cat } = await supabase.from('categories').select('*').eq('id', id).single();
    if (!cat) return alert("Category not found");
    
    const newName = prompt("New Name (leave blank to keep current):", cat.name) || cat.name;
    
    const wantsNewImage = window.confirm("Do you want to change the category image from your device gallery?");
    let finalImage = cat.img;
    if (wantsNewImage) {
      const uploadedUrl = await pickAndUploadImage();
      if (uploadedUrl) finalImage = uploadedUrl;
    }
    
    await supabase.from('categories').update({ name: newName, img: finalImage }).eq('id', id);
    alert("Category Updated!");
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
    const { error } = await supabase.from('products').insert([
      { name, price, description: desc, badge, image: imageUrl }
    ]);
    setLoading(false);
    
    if (error) alert("Error: " + error.message);
    else alert("Product Added Successfully!");
  };

  const handleAddBanner = async () => {
    const title = prompt("Enter Banner Title:");
    if (!title) return;
    const subtitle = prompt("Enter Subtitle:");
    
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required for a new banner.");
    
    setLoading(true);
    const { error } = await supabase.from('animations').insert([
      { title, subtitle, img: imageUrl }
    ]);
    setLoading(false);
    
    if (error) alert("Error: " + error.message);
    else alert("Banner Created!");
  };

  const handleAddCategory = async () => {
    const name = prompt("Enter Category Name:");
    if (!name) return;
    
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) return alert("Image is required for a category.");
    
    setLoading(true);
    const { error } = await supabase.from('categories').insert([
      { name, img: imageUrl }
    ]);
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
    const { error } = await supabase.from('subcategories').insert([
      { name, img: imageUrl, category_id: parentId }
    ]);
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
    const wantsNewImage = window.confirm("Do you want to change the image from your gallery?");
    let finalImg = sub.img;
    if (wantsNewImage) {
      const uploadedUrl = await pickAndUploadImage();
      if (uploadedUrl) finalImg = uploadedUrl;
    }
    
    await supabase.from('subcategories').update({ name: newName, img: finalImg }).eq('id', id);
    alert("Drug Class Updated!");
  };

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
            <span className="count-dot">Live</span>
          </div>
          <p>Add new inventory or manage existing prices and details.</p>
          <div className="admin-actions-row">
            <button onClick={handleAddProduct} className="admin-btn primary">Add New</button>
            <button onClick={handleEditProduct} className="admin-btn primary outline">Edit / Delete</button>
          </div>
        </div>
        
        {/* BANNERS SECTION */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Hero Banners</h3>
            <span className="count-dot yellow">Hot</span>
          </div>
          <p>Update the high-impact sliding images on the home page.</p>
          <div className="admin-actions-row">
            <button onClick={handleAddBanner} className="admin-btn primary">Create</button>
            <button onClick={handleEditBanner} className="admin-btn primary outline">Edit Slider</button>
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Categories & Classes</h3>
            <span className="count-dot blue">Grid</span>
          </div>
          <p>Manage the main 10-block matrix and their nested drug classes.</p>
          <div className="admin-actions-row">
            <button onClick={handleAddCategory} className="admin-btn primary">New Cat</button>
            <button onClick={handleEditCategory} className="admin-btn primary outline">Edit Cat</button>
          </div>
          <div className="admin-actions-row" style={{marginTop: '10px'}}>
            <button onClick={handleAddSubcategory} className="admin-btn primary outline">Add Class</button>
            <button onClick={handleEditSubcategory} className="admin-btn primary text">Edit Class</button>
          </div>
        </div>
      </div>
    </div>
  );
}
