'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button onClick={handleSignOut} disabled={loading} className="text-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}