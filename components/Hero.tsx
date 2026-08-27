'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-navy overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" aria-hidden="true" />
      
      <div className="container-custom relative z-10 py-20 px-4 text-center">
        <h1 
          id="hero-heading"
          className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-medium text-cream leading-tight text-balance mb-6"
        >
          Sleep Better Tonight
        </h1>
        <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          Premium bedding delivered across Nairobi
        </p>
        <Link
          href="/shop"
          className="btn-gold text-lg px-10 py-4 inline-block"
        >
          Shop Now
        </Link>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}