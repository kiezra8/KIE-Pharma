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
        <div className="admin-card">
          <h3>Manage Products</h3>
          <p>Upload new products, set pricing, update details, attach Shein-style galleries, and toggle "Hot/New" badges.</p>
          <button className="admin-btn primary">Open Product Editor</button>
        </div>
        
        <div className="admin-card">
          <h3>Manage Banners</h3>
          <p>Update the sliding header images on the home screen.</p>
          <button className="admin-btn primary outline">Open Banner Editor</button>
        </div>

        <div className="admin-card">
          <h3>Manage Categories</h3>
          <p>Replace generic category icons with premium image links.</p>
          <button className="admin-btn primary outline">Open Category Editor</button>
        </div>
      </div>
    </div>
  );
}
