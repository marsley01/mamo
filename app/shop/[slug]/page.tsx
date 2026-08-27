import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) return [];
  return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found | Mamo Collections' };
  }

  return {
    title: `${product.name} | Mamo Collections`,
    description: product.description || `Buy ${product.name} - KES ${product.price.toLocaleString()}. Premium bedding delivered across Nairobi.`,
    openGraph: {
      title: `${product.name} | Mamo Collections`,
      description: product.description || `Buy ${product.name} - KES ${product.price.toLocaleString()}.`,
      images: product.images[0] ? [product.images[0]] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Mamo Collections`,
      description: product.description || `Buy ${product.name} - KES ${product.price.toLocaleString()}.`,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 lg:pt-20 min-h-screen bg-cream">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}