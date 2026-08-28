'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/placeholder-product.jpg');

  return (
    <div className="container-custom py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-surface shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square overflow-hidden bg-surface ${
                    selectedImage === image ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 25vw, 15vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
              {product.category}
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-medium text-textPrimary mb-4">
              {product.name}
            </h1>
            <p className="font-heading text-3xl font-semibold text-textPrimary">
              KES {product.price.toLocaleString()}
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-8 text-textSecondary">
            <p>{product.description || 'No description available for this item.'}</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span
              className={`px-4 py-2 text-sm font-medium border ${
                product.in_stock
                  ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                  : 'bg-red-400/10 border-red-400/30 text-red-400'
              }`}
            >
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {product.in_stock && (
            <WhatsAppButton 
              productName={product.name} 
              price={product.price}
              className="w-full text-lg py-4"
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-surfaceHover pt-20">
          <h2 className="font-heading text-3xl font-medium text-textPrimary mb-12">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}