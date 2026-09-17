/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0b3b60',
          darkBlue: '#061e33',
          lightBlue: '#0284c7',
          sky: '#e0f2fe',
          green: '#059669',
          darkGreen: '#064e3b',
          emerald: '#10b981',
          lightGreen: '#ecfdf5',
          accent: '#f59e0b',
          gold: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 25px rgba(14, 165, 233, 0.25)',
        glowGreen: '0 0 25px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
