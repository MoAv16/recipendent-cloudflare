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
          DEFAULT: '#5932ea',
          50: '#f7f5ff',
          100: '#efeaff',
          200: '#dfd7ff',
          300: '#c8b6ff',
          400: '#a888ff',
          500: '#5932ea',
          600: '#4621d4',
          700: '#3818b3',
          800: '#2e1492',
          900: '#241177',
        },
        'bg-main': '#f8fafb',
        'text-dark': '#232323',
        'text-gray': '#b0b0b0',
        'border-inactive': '#afafaf',
        'purple-light': '#f7f5ff',
      },
      fontFamily: {
        'product-sans': ['Product Sans', 'sans-serif'],
        'cabin': ['Cabin', 'sans-serif'],
        'abeezee': ['ABeeZee', 'sans-serif'],
        'albert-sans': ['Albert Sans', 'sans-serif'],
        'ropa-sans': ['Ropa Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 20px 50px 0 rgba(219, 224, 248, 0.5)',
        'soft-lg': '0 20px 60px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
