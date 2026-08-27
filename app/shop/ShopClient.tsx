'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { supabase, Product, CATEGORIES } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const initialCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const initialInStock = searchParams.get('in_stock') !== 'false';
  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    setSelectedCategories(initialCategories);
    setInStockOnly(initialInStock);
    setSearchQuery(initialSearch);
  }, [initialCategories, initialInStock, initialSearch]);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    if (!inStockOnly) {
      params.set('in_stock', 'false');
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    return params.toString();
  }, [selectedCategories, inStockOnly, searchQuery]);

  const updateUrl = useCallback(() => {
    const queryString = buildQuery();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [buildQuery, pathname, router]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');

      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }
      if (inStockOnly) {
        query = query.eq('in_stock', true);
      }
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, inStockOnly, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    updateUrl();
  }, [selectedCategories, inStockOnly, searchQuery, updateUrl]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(true);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || !inStockOnly || searchQuery;

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl lg:text-4xl font-medium text-navy mb-2">Shop All</h1>
        <p className="text-text/60">Discover our complete collection of premium bedding</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0" aria-label="Product filters">
          <div className="bg-white p-6 rounded-none border border-gold/20 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-navy">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gold hover:text-gold/80 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="search" className="sr-only">Search products</label>
              <input
                id="search"
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-text placeholder:text-text/40 transition-all"
                aria-label="Search products"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-navy mb-3">Categories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-gold border-gold/30 rounded focus:ring-gold focus:ring-2 transition-colors"
                      aria-label={category}
                    />
                    <span className="text-text text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-gold border-gold/30 rounded focus:ring-gold focus:ring-2 transition-colors"
                />
                <span className="text-text text-sm">In stock only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="aspect-[4/5] bg-gold/10" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gold/10 rounded w-3/4" />
                    <div className="h-4 bg-gold/10 rounded w-1/2" />
                    <div className="h-6 bg-gold/10 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gold/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="font-playfair text-xl text-navy mb-2">No products found</h3>
              <p className="text-text/60 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-gold-outline">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-text/60 text-sm">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}