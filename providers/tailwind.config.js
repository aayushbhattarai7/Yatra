/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        'travel-primary': 'green',  
        'travel-accent': '#0ea5e9',     
        'travel-sunset': '#f97316',     
        'travel-forest': '#059669',     
        'travel-sand': '#fbbf24',       
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
