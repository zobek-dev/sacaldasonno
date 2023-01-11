/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./config/*.json",
    "./layout/*.liquid",
    "./assets/*.liquid",
    "./assets/*.js",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/*.liquid",
    "./templates/*.json",
    "./templates/customers/*.liquid",
    "./templates/customers/*.json"
  ],
  theme: {
    extend: {},
    fontFamily: {
      'barlow': ['Barlow', 'sans-serif'],
      'gobold': ['Gobold', 'sans-serif'],
      'gobold-italic': ['Gobold-Italic', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography')
  ],
}
