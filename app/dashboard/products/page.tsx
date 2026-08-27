import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

import DeleteProductButton from '@/components/DeleteProductButton';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair text-navy">Products</h1>
        <Link href="/dashboard/products/new" className="btn-gold">Add Product</Link>
      </div>
      
      <div className="bg-white rounded-none shadow border border-gold/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">In Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.name} width={50} height={50} className="object-cover" />
                  )}
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">KES {product.price.toLocaleString()}</td>
                <td className="p-4">{product.in_stock ? 'Yes' : 'No'}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/dashboard/products/${product.id}/edit`} className="text-gold">Edit</Link>
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