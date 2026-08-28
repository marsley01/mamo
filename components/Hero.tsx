'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" aria-hidden="true" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" aria-hidden="true" />
      
      <div className="container-custom relative z-10 py-20 px-4 text-center">
        <h1 
          id="hero-heading"
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-medium text-slate-50 leading-tight text-balance mb-6"
        >
          Sleep Better Tonight
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          Premium bedding delivered across Nairobi
        </p>
        <Link
          href="/shop"
          className="btn-primary text-lg px-10 py-4 inline-block"
        >
          Shop Now
        </Link>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}