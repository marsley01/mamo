/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0F172A',
        surfaceHover: '#1E293B',
        primary: '#6366F1',
        primaryHover: '#4F46E5',
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
        accent: '#D4AF37',
        cream: '#020617',
        navy: '#F8FAFC',
        gold: '#6366F1',
      },
      fontFamily: {
        heading: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        playfair: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};