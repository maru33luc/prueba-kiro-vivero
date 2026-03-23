/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'plant': {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#0f2817',
        },
        'leaf': {
          '50': '#f5fdf9',
          '100': '#ecfdf5',
          '200': '#d1fae5',
          '300': '#a7f3d0',
          '400': '#6ee7b7',
          '500': '#2dd4bf',
          '600': '#14b8a6',
          '700': '#0d9488',
          '800': '#0f766e',
          '900': '#0d5d54',
        },
        'earth': {
          '50': '#faf8f4',
          '100': '#f3ede3',
          '200': '#e8e0d5',
          '300': '#d9cebe',
          '400': '#bfa68f',
          '500': '#a68f7a',
          '600': '#8b7968',
          '700': '#6e6657',
          '800': '#544f47',
          '900': '#3e3b37',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
