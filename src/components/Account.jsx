import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Account.css';

export default function Account({ onAdminClick }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    let authError;
    
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      authError = error;
      if (!error) {
        alert("Account successfully created! You are now logged in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
    }

    if (authError) {
      alert("Error: " + authError.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isInitializing) return <div style={{padding: '50px', textAlign: 'center'}}>Loading account...</div>;

  if (!session) {
    return (
      <div className="account-container fade-in">
        <form className="auth-form" onSubmit={handleAuth}>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">Manage your medical orders & facility preferences.</p>
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="auth-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="auth-input"
          />
          
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
          
          <p className="auth-switch">
             {isSignUp ? 'Already have an account? ' : 'New to SkieZ Pharma? '}
             <span onClick={() => setIsSignUp(!isSignUp)}>
               {isSignUp ? 'Sign In' : 'Create Account'}
             </span>
          </p>
        </form>
      </div>
    );
  }

  const userEmail = session.user.email;
  const isAdmin = userEmail === 'israelezrakisakye@gmail.com';

  return (
    <div className="account-profile fade-in">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Logged in as: <strong>{userEmail}</strong></p>
        {isAdmin && <span className="admin-tag">Admin Account</span>}
      </div>
      
      <div className="profile-actions">
        <button className="profile-btn">View Order History</button>
        <button className="profile-btn">Saved Items</button>
        <button className="profile-btn">Facility Details</button>
        
        {isAdmin && (
           <button onClick={onAdminClick} className="profile-btn admin-highlight">
              Go to Admin Dashboard 
           </button>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">Log Out</button>
    </div>
  );
}
