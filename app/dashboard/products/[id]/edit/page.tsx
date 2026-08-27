import { supabase } from '@/lib/supabase';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-playfair text-navy mb-8">Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  );
}