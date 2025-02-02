/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif']
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
        dark: '2px 2px 4px rgba(0, 0, 0, 0.1)'
      },
      colors: {
        dark: '#1c1c24',
        light: '#e4dfdf',
        primary: '#1dc071'
      }
    },
    plugins: []
  }
}
