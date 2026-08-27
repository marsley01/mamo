'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Product, CATEGORIES } from '@/lib/supabase';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Mattresses',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    in_stock: initialData?.in_stock ?? true,
    images: initialData?.images || [] as string[],
  });

  const generateSlug = (name: string) => name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setLoading(true);
    const newUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      newUrls.push(publicUrl);
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      in_stock: formData.in_stock,
      images: formData.images,
    };

    if (initialData) {
      await supabase.from('products').update(payload).eq('id', initialData.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setLoading(false);
    router.push('/dashboard/products');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border border-gold/20 shadow">
      <div>
        <label className="block text-sm font-medium text-navy">Name</label>
        <input type="text" value={formData.name} onChange={handleNameChange} className="w-full p-2 border border-gold/30" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Slug</label>
        <input type="text" value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} className="w-full p-2 border border-gold/30" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Category</label>
        <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))} className="w-full p-2 border border-gold/30">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Price (KES)</label>
        <input type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full p-2 border border-gold/30" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Description</label>
        <textarea value={formData.description || ''} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full p-2 border border-gold/30" rows={4} />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-2" />
        <div className="flex gap-2 mt-2">
          {formData.images.map(url => <Image key={url} src={url} alt="Product" width={50} height={50} className="object-cover" />)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={formData.in_stock} onChange={e => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))} />
        <label>In Stock</label>
      </div>
      <button type="submit" disabled={loading} className="btn-gold">{loading ? 'Saving...' : 'Save Product'}</button>
    </form>
  );
}