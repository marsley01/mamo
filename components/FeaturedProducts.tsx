'use client';

import { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <section className="py-20 bg-cream" aria-labelledby="featured-heading">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-text/60">No products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-cream" aria-labelledby="featured-heading">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <h2 id="featured-heading" className="font-playfair text-3xl lg:text-4xl font-medium text-navy">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-gold font-medium hover:text-gold/80 transition-colors"
          >
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/shop" className="btn-gold-outline inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}