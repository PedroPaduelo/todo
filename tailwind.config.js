/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-blue': {
          light: '#63B3ED',
          DEFAULT: '#3182CE',
          dark: '#2B6CB0',
                },
        'custom-green': {
          light: '#9AE6B4',
          DEFAULT: '#48BB78',
          dark: '#38A169',
        },
        'custom-red': {
          light: '#FEB2B2',
          DEFAULT: '#E53E3E',
          dark: '#C53030',
        },
        'custom-orange': {
          light: '#FBD38D',
          DEFAULT: '#ED8936',
          dark: '#C05621',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
