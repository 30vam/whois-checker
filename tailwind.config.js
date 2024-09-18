/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        'main': ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
}

