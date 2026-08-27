'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-none shadow-xl w-full max-w-md border border-gold/20">
        <h1 className="font-playfair text-3xl font-medium text-navy mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gold/30 rounded-none focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gold/30 rounded-none focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}