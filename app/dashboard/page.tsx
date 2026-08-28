import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from('products').select('*');
   
  const totalProducts = products?.length || 0;
  const outOfStockProducts = products?.filter(p => !p.in_stock) || [];
   
  const categoryCounts: Record<string, number> = {};
  products?.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-3xl font-heading text-textPrimary mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg shadow border border-surfaceHover">
          <p className="text-textSecondary">Total Products</p>
          <p className="text-4xl font-bold text-textPrimary">{totalProducts}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow border border-surfaceHover">
          <p className="text-textSecondary">Out of Stock</p>
          <p className="text-4xl font-bold text-red-400">{outOfStockProducts.length}</p>
        </div>
      </div>
       
      <div className="bg-surface p-6 rounded-lg shadow border border-surfaceHover">
        <h2 className="text-xl font-medium text-textPrimary mb-4">Out of Stock Items</h2>
        {outOfStockProducts.length === 0 ? (
          <p className="text-textSecondary">All items are in stock.</p>
        ) : (
          <ul>
            {outOfStockProducts.map(p => (
              <li key={p.id} className="py-2 border-b border-surfaceHover">{p.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}