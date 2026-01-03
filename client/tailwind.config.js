/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Cream & Beige Palette
        cream: {
          DEFAULT: '#F5F1E8',
          light: '#FAF8F3',
          dark: '#E8E2D5',
        },

        // Gold & Bronze Accents
        gold: {
          DEFAULT: '#B8860B',
          light: '#DAA520',
          dark: '#8B6914',
        },

        // Neutral & Text Colors
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#4A4A4A',
        },

        'warm-gray': '#8B7E74',
        border: '#D4C5B0',

        // Semantic Colors with Luxury Touch
        success: '#2D7A4F',
        warning: '#C17817',
        danger: '#A04040',
        info: '#4A7C9C',
      },

      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },

      boxShadow: {
        'luxury': '0 4px 20px rgba(184, 134, 11, 0.1)',
        'luxury-hover': '0 8px 30px rgba(184, 134, 11, 0.2)',
      },

      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
