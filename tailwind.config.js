/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f9305b',
      },
    },
  },
  plugins: [],
}