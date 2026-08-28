'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Product, CATEGORIES } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    if (!inStockOnly) {
      params.set('in_stock', 'false');
    }
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    return params.toString();
  }, [selectedCategories, inStockOnly, debouncedSearch]);

  const updateUrl = useCallback(() => {
    const queryString = buildQuery();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  }, [buildQuery, pathname, router]);

  const fetchProducts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('products').select('*');

      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }
      if (inStockOnly) {
        query = query.eq('in_stock', true);
      }
      if (debouncedSearch) {
        query = query.ilike('name', `%${debouncedSearch}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      if (!controller.signal.aborted) {
        setProducts(data || []);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      if (!controller.signal.aborted) {
        console.error('Error fetching products:', err);
        setError(message);
        setProducts([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [selectedCategories, inStockOnly, debouncedSearch, supabase]);

  useEffect(() => {
    fetchProducts();
    return () => abortControllerRef.current?.abort();
  }, [fetchProducts]);

  useEffect(() => {
    updateUrl();
  }, [selectedCategories, inStockOnly, debouncedSearch, updateUrl]);

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

  const hasActiveFilters = selectedCategories.length > 0 || !inStockOnly || debouncedSearch;

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl font-medium text-textPrimary mb-2">Shop All</h1>
        <p className="text-textSecondary">Discover our complete collection of premium bedding</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0" aria-label="Product filters">
          <div className="bg-surface p-6 rounded-lg border border-surfaceHover sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-medium text-textPrimary">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primaryHover font-medium transition-colors"
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
                className="w-full px-4 py-3 border border-surfaceHover focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder:text-textSecondary/60 transition-all bg-background rounded-md"
                aria-label="Search products"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-textPrimary mb-3">Categories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 -webkit-overflow-scrolling-touch">
                {CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-primary border-surfaceHover rounded focus:ring-primary focus:ring-2 transition-colors"
                      aria-label={category}
                    />
                    <span className="text-textPrimary text-sm">{category}</span>
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
                  className="w-4 h-4 text-primary border-surfaceHover rounded focus:ring-primary focus:ring-2 transition-colors"
                />
                <span className="text-textPrimary text-sm">In stock only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {error ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-heading text-xl text-textPrimary mb-2">Something went wrong</h3>
              <p className="text-textSecondary/60 mb-6">{error}</p>
              <button onClick={fetchProducts} className="btn-primary-outline">
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="aspect-[4/5] bg-surfaceHover" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-surfaceHover rounded w-3/4" />
                    <div className="h-4 bg-surfaceHover rounded w-1/2" />
                    <div className="h-6 bg-surfaceHover rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-primary/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="font-heading text-xl text-textPrimary mb-2">No products found</h3>
              <p className="text-textSecondary/60 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary-outline">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-textSecondary/60 text-sm">
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