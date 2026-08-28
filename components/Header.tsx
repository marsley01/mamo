'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="font-heading text-2xl lg:text-3xl font-semibold text-slate-50 tracking-tight" aria-label="Mamo Collections Home">
            Mamo Collections
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-body text-slate-300 transition-colors duration-200 hover:text-indigo-400 ${
                  pathname === link.href ? 'text-indigo-400' : ''
                } after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${pathname === link.href ? 'after:scale-x-100' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3 4-4" />
              </svg>
              Shop
            </Link>
            <a
              href="https://wa.me/254725907608"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-6 py-2 hidden sm:inline-flex"
            >
              WhatsApp Order
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}