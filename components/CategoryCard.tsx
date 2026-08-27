'use client';

import Link from 'next/link';

const categoryIcons: Record<string, React.ReactNode> = {
  Duvets: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
    </svg>
  ),
  Curtains: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
    </svg>
  ),
  Pillows: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Bedsheets: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

interface CategoryCardProps {
  category: string;
  count?: number;
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  const Icon = categoryIcons[category] || categoryIcons.Mattresses;

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category)}`}
      className="category-card group"
      aria-label={`Shop ${category}`}
    >
      <div className="absolute inset-0 bg-navy/5 transition-opacity duration-300 group-hover:bg-navy/10" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-gold mb-4 group-hover:scale-110 transition-transform duration-300">
          {Icon}
        </div>
        <h3 className="font-playfair text-xl lg:text-2xl font-medium text-navy mb-1">
          {category}
        </h3>
        {count !== undefined && (
          <p className="text-text/60 text-sm">{count} {count === 1 ? 'product' : 'products'}</p>
        )}
      </div>
    </Link>
  );
}