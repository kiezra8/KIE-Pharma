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
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setIsInitializing(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (isInitializing) return <div className="admin-status">Connecting SkieZ Core...</div>;

  return (
    <div className="admin-auth-page fade-in">
      {!session ? (
        <form className="auth-card pro-style" onSubmit={handleLogin}>
          <h2>SKIEZ ADMIN</h2>
          <p>Sign in to unlock Live In-App Editing modes.</p>
          <div className="admin-input-row">
            <input type="email" placeholder="Master Identity" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="admin-input-row">
            <input type="password" placeholder="Master Key" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="master-auth-btn">
            {loading ? 'Authenticating...' : 'Unlock Secure Admin Mode'}
          </button>
        </form>
      ) : (
        <div className="auth-card pro-style status-view">
          <h2>ADMIN ACTIVE</h2>
          <div className="status-pill-green">Verified: {session.user.email}</div>
          <p>Live Editing is now enabled across the entire storefront.</p>
          <button onClick={() => window.location.href = '/'} className="return-home-btn">Browse & Edit Store</button>
          <button onClick={handleSignOut} className="signout-text-btn">Lock Core & Sign Out</button>
        </div>
      )}
    </div>
  );
}
