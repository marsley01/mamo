'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product, CATEGORIES } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setError('Maximum 5 images allowed');
      return;
    }

    setLoading(true);
    setError(null);
    const newUrls: string[] = [];

    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
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
        const { error } = await supabase.from('products').update(payload).eq('id', initialData.id);
        if (error) throw error;
        setSuccess('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        setSuccess('Product created successfully');
      }

      setTimeout(() => {
        router.push('/dashboard/products');
        router.refresh();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-lg border border-surfaceHover shadow">
      {error && (
        <div className="bg-red-400/10 border border-red-400/30 text-red-400 p-4 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 p-4 rounded-md text-sm">
          {success}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-textSecondary mb-1.5">Name</label>
        <input id="name" type="text" value={formData.name} onChange={handleNameChange} className="w-full p-2 border border-surfaceHover bg-background text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" required />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-textSecondary mb-1.5">Slug</label>
        <input id="slug" type="text" value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} className="w-full p-2 border border-surfaceHover bg-background text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" required />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-textSecondary mb-1.5">Category</label>
        <select id="category" value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))} className="w-full p-2 border border-surfaceHover bg-background text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-textSecondary mb-1.5">Price (KES)</label>
        <input id="price" type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full p-2 border border-surfaceHover bg-background text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-textSecondary mb-1.5">Description</label>
        <textarea id="description" value={formData.description || ''} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full p-2 border border-surfaceHover bg-background text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" rows={4} />
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-textSecondary mb-1.5">Images</label>
        <input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-2 rounded-md" disabled={loading} />
        <div className="flex gap-2 mt-2">
          {formData.images.map(url => <Image key={url} src={url} alt="Product" width={50} height={50} className="object-cover rounded" />)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="in_stock" type="checkbox" checked={formData.in_stock} onChange={e => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))} className="w-4 h-4 text-primary border-surfaceHover rounded focus:ring-primary focus:ring-2 transition-colors" />
        <label htmlFor="in_stock" className="text-textPrimary">In Stock</label>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Product'}</button>
    </form>
  );
}