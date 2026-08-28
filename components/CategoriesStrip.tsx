'use client';

import { CATEGORIES } from '@/lib/supabase';
import CategoryCard from './CategoryCard';

interface CategoriesStripProps {
  counts?: Record<string, number>;
}

export default function CategoriesStrip({ counts = {} }: CategoriesStripProps) {
  return (
    <section className="py-16 bg-surface" aria-labelledby="categories-heading">
      <div className="container-custom">
        <h2 id="categories-heading" className="font-heading text-3xl lg:text-4xl font-medium text-textPrimary text-center mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              count={counts[category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}