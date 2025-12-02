/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files in src for Tailwind classes
    "./public/index.html",      // Also scan index.html if you have Tailwind classes there
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
