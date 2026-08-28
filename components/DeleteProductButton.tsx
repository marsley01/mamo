'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}