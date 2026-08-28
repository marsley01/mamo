import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 lg:pt-20 min-h-screen bg-background">
        <Suspense fallback={<div className="container-custom py-12">Loading...</div>}>
          <ShopClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}