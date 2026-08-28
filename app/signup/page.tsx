'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Account created! Please check your email to confirm your account.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" aria-hidden="true" />
      <form onSubmit={handleSignup} className="relative z-10 bg-surface p-8 rounded-lg shadow-2xl w-full max-w-md border border-surfaceHover">
        <h1 className="font-heading text-3xl font-medium text-textPrimary mb-2 text-center">Create Account</h1>
        <p className="text-textSecondary text-center mb-8 text-sm">Sign up for an admin account</p>
        {error && <p className="text-red-400 mb-4 text-sm text-center bg-red-400/10 p-3 rounded-md">{error}</p>}
        {success && <p className="text-emerald-400 mb-4 text-sm text-center bg-emerald-400/10 p-3 rounded-md">{success}</p>}
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textSecondary mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder:text-textSecondary/50 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-textSecondary mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder:text-textSecondary/50 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-textSecondary mb-1.5">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder:text-textSecondary/50 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-textSecondary">
          Already have an account? <Link href="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
