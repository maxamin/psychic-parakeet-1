/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: { 
      fontFamily: {
      'bebas-neue': ['Bebas Neue', 'sans-serif'],
      'Inter': ['Inter', 'sans-serif'],
      
    },},
  
  },
  plugins: [],
}

