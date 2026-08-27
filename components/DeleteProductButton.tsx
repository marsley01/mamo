'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    await supabase.from('products').delete().eq('id', id);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-600">Delete</button>
  );
}