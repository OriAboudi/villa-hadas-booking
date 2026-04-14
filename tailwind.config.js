/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Heebo', 'sans-serif'],
        display: ['Frank Ruhl Libre', 'serif'],
      }
    },
  },
  plugins: [],
}
