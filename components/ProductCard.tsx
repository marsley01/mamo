'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const whatsappUrl = `https://wa.me/254725907608?text=${encodeURIComponent(
    `Hi! I want to order: ${product.name} - KES ${product.price.toLocaleString()}. Please confirm availability and delivery.`
  )}`;

  const firstImage = product.images[0] || '/placeholder-product.jpg';

  return (
    <article className="product-card group">
      <Link href={`/shop/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-background">
          <Image
            src={firstImage}
            alt={`${product.name} - main product image`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
              <span className="font-heading text-slate-50 text-lg font-medium px-4 py-2 border-2 border-slate-50">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {product.category}
            </span>
            {product.in_stock && (
              <span className="text-xs font-medium text-emerald-400">In Stock</span>
            )}
          </div>

          <h3 className="font-heading text-lg font-medium text-textPrimary mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <p className="font-heading text-xl font-semibold text-textPrimary">
              KES {product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-4 btn-primary text-center py-3 text-sm font-medium"
        aria-label={`Order ${product.name} via WhatsApp`}
      >
        Order via WhatsApp
      </a>
    </article>
  );
}