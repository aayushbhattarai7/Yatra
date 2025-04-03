/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'travel-primary': '#2563eb',  
        'travel-accent': '#0ea5e9',     
        'travel-sunset': '#f97316',     
        'travel-forest': '#059669',     
        'travel-sand': '#fbbf24',       
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], 
      },
    },
  },
  safelist: [
    'text-travel-primary',
    'text-travel-accent',
    'text-travel-sunset',
    'text-travel-forest',
    'text-travel-sand',
  ],
  plugins: [],
};
