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