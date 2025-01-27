/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [],
  theme: {
    extend: {},
    fontFamily: {
      gotham_bold: ["Gotham Bold", "sans-serif"],
      gotham_book: ["Gotham Book", "sans-serif"],
      gotham_light: ["Gotham Light", "sans-serif"],
      gotham_medium: ["Gotham Medium", "sans-serif"],
    },
  },
  content: ["./src/**/*.{html,ts}"],
};
