/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#F5F5DC',
        'background-dark': '#1a1a1a',
        'text-light': '#F5F5DC',
        'favorites': '#A8C3B3',
        // 'favorites': '#667744',
        'button-primary': '#2A4033',
      },
    },
  },
  plugins: [],
}

