import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mamo Collections | Premium Bedding in Nairobi',
  description: 'Luxury mattresses, bedsheets, duvets, pillows, and blankets delivered across Nairobi. Sleep better tonight with Mamo Collections.',
  keywords: ['bedding', 'mattresses', 'bedsheets', 'duvets', 'pillows', 'blankets', 'Nairobi', 'Kenya'],
  authors: [{ name: 'Mamo Collections' }],
  creator: 'Mamo Collections',
  publisher: 'Mamo Collections',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://mamocollections.co.ke',
    title: 'Mamo Collections | Premium Bedding in Nairobi',
    description: 'Luxury mattresses, bedsheets, duvets, pillows, and blankets delivered across Nairobi.',
    siteName: 'Mamo Collections',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mamo Collections | Premium Bedding in Nairobi',
    description: 'Luxury mattresses, bedsheets, duvets, pillows, and blankets delivered across Nairobi.',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#1A1A2E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}