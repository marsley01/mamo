import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
  const { data: products } = await supabase.from('products').select('*');
  
  const totalProducts = products?.length || 0;
  const outOfStockProducts = products?.filter(p => !p.in_stock) || [];
  
  const categoryCounts: Record<string, number> = {};
  products?.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-3xl font-playfair text-navy mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-none shadow border border-gold/20">
          <p className="text-text/60">Total Products</p>
          <p className="text-4xl font-bold text-navy">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-none shadow border border-gold/20">
          <p className="text-text/60">Out of Stock</p>
          <p className="text-4xl font-bold text-red-600">{outOfStockProducts.length}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-none shadow border border-gold/20">
        <h2 className="text-xl font-medium text-navy mb-4">Out of Stock Items</h2>
        {outOfStockProducts.length === 0 ? (
          <p className="text-text/60">All items are in stock.</p>
        ) : (
          <ul>
            {outOfStockProducts.map(p => (
              <li key={p.id} className="py-2 border-b">{p.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}