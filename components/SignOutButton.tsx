'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleSignOut} className="text-sm text-cream/60 hover:text-gold transition-colors">
      Sign Out
    </button>
  );
}