import { Metadata } from 'next';
import { supabase, Product } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CategoriesStrip from '@/components/CategoriesStrip';
import FeaturedProducts from '@/components/FeaturedProducts';

export const metadata: Metadata = {
  title: 'Mamo Collections | Premium Bedding in Nairobi',
  description: 'Luxury mattresses, bedsheets, duvets, pillows, and blankets delivered across Nairobi. Sleep better tonight with Mamo Collections.',
};

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('in_stock', true);

  if (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  data?.forEach((product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });

  return counts;
}

export default async function HomePage() {
  const [featuredProducts, categoryCounts] = await Promise.all([
    getFeaturedProducts(),
    getCategoryCounts(),
  ]);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 lg:pt-20">
        <Hero />
        <CategoriesStrip counts={categoryCounts} />
        <FeaturedProducts products={featuredProducts} />
      </main>
      <Footer />
    </>
  );
}