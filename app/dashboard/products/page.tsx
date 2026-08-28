import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

import DeleteProductButton from '@/components/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-textPrimary">Products</h1>
        <Link href="/dashboard/products/new" className="btn-primary">Add Product</Link>
      </div>
       
      <div className="bg-surface rounded-lg shadow border border-surfaceHover overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background">
            <tr>
              <th className="p-4 text-textSecondary font-medium">Image</th>
              <th className="p-4 text-textSecondary font-medium">Name</th>
              <th className="p-4 text-textSecondary font-medium">Category</th>
              <th className="p-4 text-textSecondary font-medium">Price</th>
              <th className="p-4 text-textSecondary font-medium">In Stock</th>
              <th className="p-4 text-textSecondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => (
              <tr key={product.id} className="border-b border-surfaceHover">
                <td className="p-4">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.name} width={50} height={50} className="object-cover rounded" />
                  )}
                </td>
                <td className="p-4 text-textPrimary">{product.name}</td>
                <td className="p-4 text-textPrimary">{product.category}</td>
                <td className="p-4 text-textPrimary">KES {product.price.toLocaleString()}</td>
                <td className="p-4 text-textPrimary">{product.in_stock ? 'Yes' : 'No'}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/dashboard/products/${product.id}/edit`} className="text-primary hover:text-primaryHover transition-colors">Edit</Link>
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}