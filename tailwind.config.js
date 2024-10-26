/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        main: "#0D21A1",
        accent: "#89A6FB",
        dark: "#2E3532",
        light: "#F1FAEE"
      }
    },
  },
  plugins: [],
}
