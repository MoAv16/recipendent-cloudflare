/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ad42b3',
          50: '#faf5fb',
          100: '#f4ebf6',
          200: '#e9d6ec',
          300: '#d8b4dd',
          400: '#c088c7',
          500: '#ad42b3',
          600: '#944998',
          700: '#7a3a7c',
          800: '#663367',
          900: '#552c56',
        },
      },
    },
  },
  plugins: [],
}
