import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
   
  if (!user) {
    redirect('/login');
  }

  const menuItems = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Products', href: '/dashboard/products' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6">
          <Link href="/dashboard" className="font-heading text-2xl font-semibold text-primary">
            Mamo Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 px-4 rounded hover:bg-primary/20 hover:text-primary transition-colors"
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