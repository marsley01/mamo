import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  const menuItems = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Products', href: '/dashboard/products' },
  ];

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="w-64 bg-navy text-cream flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="font-playfair text-2xl font-semibold text-gold">
            Mamo Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 px-4 rounded hover:bg-gold/20 hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}