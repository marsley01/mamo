import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase environment variables');
    }
    return null;
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Create a properly typed mock for build time
const mockFrom = () => ({
  select: () => ({
    eq: () => ({
      single: () => Promise.resolve({ data: null as any, error: null }),
      order: () => Promise.resolve({ data: [] as any, error: null }),
    }),
    order: () => Promise.resolve({ data: [] as any, error: null }),
  }),
  insert: () => Promise.resolve({ data: null as any, error: null }),
  update: () => ({ eq: () => Promise.resolve({ data: null as any, error: null }) }),
  delete: () => ({ eq: () => Promise.resolve({ data: null as any, error: null }) }),
});

const mockAuth = () => ({
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  signInWithPassword: () => Promise.resolve({ data: null, error: null }),
  signOut: () => Promise.resolve({ error: null }),
});

const mockStorage = () => ({
  from: () => ({
    upload: () => Promise.resolve({ data: null, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: '' } }),
  }),
});

const mockClient = {
  from: mockFrom,
  auth: mockAuth(),
  storage: mockStorage(),
} as unknown as SupabaseClient;

// Export a proxy that lazily initializes
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase() ?? mockClient;
    return (client as any)[prop];
  },
});

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  category: 'Duvets' | 'Curtains' | 'Pillows' | 'Bedsheets';
  in_stock: boolean;
  created_at: string;
};

export type Category = Product['category'];

export const CATEGORIES: Category[] = [
  'Duvets',
  'Curtains',
  'Pillows',
  'Bedsheets',
];