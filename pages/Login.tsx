
import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { Session } from '@supabase/supabase-js';
import { View } from '../types';

interface LoginProps {
  session: Session | null;
  navigate: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>, view: View, path: string) => void;
}

const Login: React.FC<LoginProps> = ({ session, navigate }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate(e, 'home', '/');
  };

  if (session) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center px-4 py-12 animate-fade-in-up sm:px-6 sm:py-16">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white/60 p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-2xl font-serif text-[#37352f] mb-2">Welcome Back</h1>
          <p className="text-sm text-[#37352f]/60 mb-6 truncate">{session.user.email}</p>
          <div className="space-y-3">
            <button
              onClick={(e) => navigate(e, 'dashboard', '/dashboard')}
              className="w-full bg-[#37352f] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-md hover:bg-black transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-[#37352f]/80 text-xs font-bold uppercase tracking-widest py-3 rounded-md hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center px-4 py-12 animate-fade-in-up sm:px-6 sm:py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#37352f] mb-1">{isSignUp ? 'Create Account' : 'Admin Portal'}</h1>
            <p className="text-[#37352f]/60">{isSignUp ? 'Sign up for a new account.' : 'Please sign in to continue.'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-[#37352f]/70 block mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white/80 border border-gray-300 rounded-md focus:ring-1 focus:ring-black/50 focus:border-black/50 outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-[#37352f]/70 block mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white/80 border border-gray-300 rounded-md focus:ring-1 focus:ring-black/50 focus:border-black/50 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <p className={`text-xs p-2 rounded-md ${error.includes('Check your email') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#37352f] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-md hover:bg-black transition-colors disabled:bg-gray-400"
            >
              {loading ? (isSignUp ? 'Creating...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-[#37352f]/60 hover:text-[#37352f] transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
