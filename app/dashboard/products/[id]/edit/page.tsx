import { createClient } from '@/utils/supabase/server';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-heading text-textPrimary mb-8">Edit Product</h1>
      <ProductForm initialData={product as Product} />
    </div>
  );
}