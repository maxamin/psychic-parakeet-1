/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yellow': '#E0D817',
        'blue': '#0F172A',
        'whiteOne': '#F2F2F2',
        'whiteTwo': '#F7F6F0',
      },
      borderRadius:{
        twenty : '25px',
        fifteen : '15px'
      },
      screens: {
        lg: { max: "1800px" },
        md: { max: "1200px" },
        sm: { max: "600px" },
        xs: { max: "400px" },
        minmd: "1700px",
        minlg: { max : "2100px" },
      },
    },
  },
  plugins: [],
}