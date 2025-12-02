module.exports = {
  plugins: {
    // 1. Tailwind must be listed first to inject its utility classes
    'tailwindcss': {}, 
    // 2. Autoprefixer must run after Tailwind to handle cross-browser compatibility
    'autoprefixer': {}, 
  },
}