/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        ink: '#18212f',
        muted: '#737d8d',
        brand: '#635bff',
        mint: '#ddf7eb',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(35, 48, 72, 0.07)',
      },
    },
  },
  plugins: [],
}
