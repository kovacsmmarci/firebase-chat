// src/components/Auth.jsx
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

export default function Auth(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clear = () => { setError(''); };

  const signup = async () => {
    clear();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } catch (e) {
      setError(e.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  const login = async () => {
    clear();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  const googleSignIn = async () => {
    clear();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <div className="auth-card" role="region" aria-label="Authentication card">
        <div className="auth-header">
          <div className="auth-logo">FC</div>
          <div>
            <div className="auth-title">Firebase Chat with módosítás</div>
          </div>
        </div>

        <div style={{marginTop:6}}>
          <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:6}}>
            <button
              className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMode('login')}
              aria-pressed={mode === 'login'}
              disabled={loading}
            >
              Log in
            </button>
            <button
              className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMode('signup')}
              aria-pressed={mode === 'signup'}
              disabled={loading}
            >
              Sign up
            </button>
          </div>

          <div className="form-row" style={{marginTop:6}}>
            {mode === 'signup' && (
              <input
                className="input"
                value={displayName}
                onChange={(e)=>setDisplayName(e.target.value)}
                placeholder="Display name (optional)"
                aria-label="Display name"
              />
            )}

            <input
              className="input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              aria-label="Email"
            />

            <input
              className="input"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              type="password"
              aria-label="Password"
            />
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <div className="row" style={{marginTop:12}}>
            <div style={{display:'flex', gap:8}}>
              <button
                className="btn btn-primary"
                onClick={mode === 'login' ? login : signup}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </div>

          <div className="divider"><span>or</span></div>

          <button className="google-btn" onClick={googleSignIn} disabled={loading} aria-label="Sign in with Google">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden>
              <path fill="#EA4335" d="M24 9.5c3.9 0 7.1 1.5 9.3 3.5L38.2 7C34.3 3.6 29.4 1.5 24 1.5 14.9 1.5 6.9 7.9 3.1 15.9l9.7 7.5C14.3 16.2 18.7 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24.5c0-1.5-.1-2.9-.4-4.3H24v8.2h12.7c-.5 2.8-2.1 5.1-4.6 6.7l7.1 5.5C44.6 36.1 46.5 30.7 46.5 24.5z"/>
              <path fill="#4A90E2" d="M12.8 29.1c-.9-2.6-1.4-5.4-1.4-8.1 0-2.7.5-5.5 1.4-8.1L3.1 5.4C.9 9.1 0 13.4 0 17.9c0 4.5.9 8.8 3.1 12.5l9.7-1.3z"/>
              <path fill="#FBBC05" d="M24 46.5c5.4 0 10.3-1.9 14.2-5.2l-7.1-5.5c-2 1.4-4.5 2.2-7.1 2.2-5.3 0-9.7-6.7-11.2-13.4L3.1 32.6C6.9 40.6 14.9 46.5 24 46.5z"/>
            </svg>
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}
