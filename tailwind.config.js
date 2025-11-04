/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-bg': 'var(--main-bg)',
        'main-bg-90': 'var(--main-bg-90)',
        'main-text': 'var(--main-text)',
        'gray': 'var(--gray)',
        'details': 'var(--details)',
        'main-title': 'var(--main-title)',
        'subtitle': 'var(--subtitle)',
        'btn': 'var(--btn)',
        'btn-text': 'var(--btn-text)',
        'brackets': 'var(--brackets)',
        'hover': 'var(--hover)',
        'labels': 'var(--labels)',
        'shadow': 'var(--shadow)',
        'card-code': 'var(--card-code)',
        'hover-card': 'var(--hover-card)',
        'modal-bg': 'var(--modal-bg)',
        'section-light': 'var(--section-light)',
        'section-light-90': 'var(--section-light-90)'
      }
    },
  },
  plugins: [],
}